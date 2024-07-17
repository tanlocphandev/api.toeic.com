"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const Transaction = require("../db/transaction.db");
const { testModel } = require("../models/test.model");
const { partModel } = require("../models/part.model");
const { questionTypeModel } = require("../models/questionType.model");
const { generateSlug, generateRandomString, randomNumber } = require("../utils");

class TestService {
    static async create({ testName, testOfYear, testNoOfYear, duration }) {
        // Check if the tag already exists
        const foundTag = await testModel.findByName(testName);

        if (foundTag) {
            throw new ConflictRequestError("Tên bài thi đã tồn tại", undefined, {
                testName: "Tên bài thi đã tồn tại",
            });
        }

        const payload = {
            test_name: tagName,
            test_slug: generateSlug(tagName),
            test_of_year: testOfYear,
            test_duration: duration,
            test_tag: `#TOEIC-${testOfYear}`,
            test_no_of_year: testNoOfYear,
        };

        const newTag = await testModel.insert(payload);

        return newTag.insertId;
    }

    static async createMultipleWithUploadFile(tags = []) {
        if (!tags.length) throw new NotfoundRequestError("Vui lòng upload ít nhất 1 row");

        // Check if the tag already exists
        const foundTags = await testModel.findByNameMultiple(tags);

        if (foundTags.length) {
            throw new ConflictRequestError(
                "Có tag đã tồn tại",
                undefined,
                foundTags.map((t) => ({ tagName: t.tag_name }))
            );
        }

        // Create new tags
        const payload = tags.map((tag) => [
            tag.tagName,
            generateSlug(tag.tagName),
            generateRandomString(16),
        ]);

        const newTags = await testModel.insertBulk({
            data: payload,
            fields: ["tag_name", "tag_slug", "tag_id"],
        });

        return newTags;
    }

    static async update(testId, data) {
        // Check if the tag already exists
        const foundTag = await testModel.findByName(data.test_name);

        if (foundTag && foundTag.test_id !== testId) {
            throw new ConflictRequestError("Tên tag đã tồn tại", undefined, {
                tagName: "Tên tag đã tồn tại",
            });
        }

        const payload = {
            ...data,
            tag_slug: generateSlug(data.test_name),
        };

        return await testModel.updateById(testId, payload);
    }

    static async findById(testId) {
        const foundTest = await testModel.findById(testId);

        if (!foundTest) throw new NotfoundRequestError(`Không tìm thấy bài thi có id ${testId}`);

        return foundTest;
    }

    static async find(filters) {
        const { results, pagination } = await testModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }

    static async createWithUploadQuestion({
        testName,
        testOfYear,
        testNoOfYear,
        duration,
        questions = [],
        parts = [],
    }) {
        let questionType = null;

        const connection = await Transaction.startTransaction();

        try {
            // Check if year and no of year already exists
            const foundTest = await Transaction.findOne({
                tableName: testModel.tableName,
                conditions: { test_of_year: testOfYear, test_no_of_year: testNoOfYear },
                connection,
            });

            if (foundTest) {
                throw new ConflictRequestError("Có bài thi đã tồn tại", undefined, {
                    testName: "Tên bài thi đã tồn tại",
                });
            }

            // Create new test
            const payloadTest = {
                test_id: randomNumber(),
                test_name: testName,
                test_slug: generateSlug(testName),
                test_of_year: testOfYear,
                test_duration: duration,
                test_tag: `#TOEIC-${testOfYear}`,
                test_no_of_year: testNoOfYear,
            };

            // Create new test part
            const payloadTestPart = await Promise.all(
                parts.map(async (part) => {
                    // Check if part already exists
                    let foundPart = await Transaction.findOne({
                        tableName: partModel.tableName,
                        conditions: { part_number: part },
                        connection,
                    });

                    // If not found, create new part
                    if (!foundPart) {
                        const partName = `Part ${part}`;

                        const payload = {
                            part_name: partName,
                            part_slug: generateSlug(partName),
                            part_id: generateRandomString(16),
                            part_number: part,
                        };

                        foundPart = payload;

                        await Transaction.insert({
                            connection,
                            data: payload,
                            tableName: partModel.tableName,
                        });
                    }

                    // return [part_id, test_id, part_number]
                    return [foundPart.part_id, payloadTest.test_id, part];
                })
            );

            // Create new question
            const payloadQuestions = await Promise.all(
                questions.map(async (question) => {
                    // Found question type
                    if (!questionType?.type_name !== question.question_type) {
                        const foundQuestionType = await Transaction.findOne({
                            tableName: questionTypeModel.tableName,
                            conditions: { type_name: question.question_type },
                            connection,
                        });

                        if (!foundQuestionType) {
                            // Create new question type if not found
                            const payloadQuestionType = {
                                type_name: question.question_type,
                            };

                            const added = await Transaction.insert({
                                connection,
                                data: payloadQuestionType,
                                tableName: questionTypeModel.tableName,
                            });

                            questionType = { ...payloadQuestionType, type_id: added.insertId };
                        } else {
                            questionType = foundQuestionType;
                        }
                    }

                    // Check if is group question.
                    if (question.group_id) {
                        // Create group question
                        const payloadGroupQuestion = {
                            group_question_order: question.group_question_order,
                            group_audio: JSON.stringify(question?.uploadAudioCloud) || "",
                            group_image: JSON.stringify(question?.uploadImageCloud) || "",
                            group_text: question?.text || "",
                            group_transcript: question.group_transcript,
                        };

                        const addedGroupQuestion = await Transaction.insert({
                            connection,
                            data: payloadGroupQuestion,
                            tableName: "group_questions",
                        });

                        const foundPart = payloadTestPart.find(
                            ([_partId, _test_id, part]) => part === question.part
                        );

                        const payloadNewQuestions = question.group_questions.map((row) => {
                            const questionId = randomNumber();

                            return [
                                questionId,
                                row.order,
                                row.audio,
                                row.image,
                                row.text_question,
                                row.transcript,
                                row.explain,
                                addedGroupQuestion.insertId,
                                foundPart?.[0],
                                foundPart?.[1],
                            ];
                        });

                        return payloadNewQuestions;
                    }

                    // Check if order question already exists

                    // const foundQuestion = await Transaction.findOne({
                    //     tableName: questionModel.tableName,
                    //     conditions: { question_order: question.order },
                    //     connection,
                    // });

                    // Create payload new question
                    const payloadNewQuestion = {
                        question_type_id: questionType.type_id,
                        question_order: question.order,
                        question_audio: JSON.stringify(question?.uploadAudioCloud) || "",
                        question_image: JSON.stringify(question?.uploadImageCloud) || "",
                        question_text: question?.question_text || "",
                        question_transcript: question?.question_transcript || "",
                        question_explain: question?.question_explain || "",
                        part_id: payloadTestPart[0],
                        test_id: payloadTest.test_id,
                    };
                })
            );

            await Transaction.commit(connection);

            return { payloadTest, payloadTestPart };
        } catch (error) {
            await Transaction.rollback(connection);
            throw error;
        } finally {
            await Transaction.release(connection);
        }

        // const connection = await Transaction.startTransaction();
        // try {
        //     const payload = {
        //         test_id: randomNumber(),
        //         test_name: testName,
        //         test_slug: generateSlug(testName),
        //         test_of_year: testOfYear,
        //         test_duration: duration,
        //         test_tag: `#TOEIC-${testOfYear}`,
        //         test_no_of_year: testNoOfYear,
        //     };
        //     const addedTest = await Transaction.insert({
        //         connection,
        //         data: payload,
        //         tableName: testModel.tableName,
        //     });
        //     const getTests = await Transaction.find({ connection, tableName: testModel.tableName });
        //     await Transaction.commit(connection);
        //     return { addedTest, getTests };
    }
}

module.exports = TestService;
