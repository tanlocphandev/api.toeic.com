"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const Transaction = require("../db/transaction.db");
const { testModel } = require("../models/test.model");
const { partModel } = require("../models/part.model");
const { questionTypeModel } = require("../models/questionType.model");
const { groupQuestionModel } = require("../models/groupQuestion.model");
const { questionModel } = require("../models/question.model");
const { testPartModel } = require("../models/testPart.model");
const { answerModel } = require("../models/answer.model");
const { tagModel } = require("../models/tag.model");
const { questionTagModel } = require("../models/questionTag.model");
const { generateSlug, generateRandomString, mapValue, asyncPool } = require("../utils");

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
        const connection = await Transaction.startTransaction();

        try {
            // Check if year and no of year already exists
            let [foundTest, currentQuestionIdAutoIncrement] = await Promise.all([
                Transaction.findOne({
                    tableName: testModel.tableName,
                    conditions: { test_of_year: testOfYear, test_no_of_year: testNoOfYear },
                    connection,
                }),
                Transaction.getCurrentAutoIncrement({
                    tableName: questionModel.tableName,
                    connection,
                }),
            ]);

            if (foundTest) {
                throw new ConflictRequestError("Có bài thi đã tồn tại", undefined, {
                    testName: "Tên bài thi đã tồn tại",
                });
            }

            // prepare payload for test
            const payloadTest = {
                test_name: testName,
                test_slug: generateSlug(testName),
                test_of_year: testOfYear,
                test_duration: duration,
                test_tag: `#TOEIC-${testOfYear}`,
                test_no_of_year: testNoOfYear,
                test_audio: null,
            };

            // insert new test
            const addedTest = await Transaction.insert({
                connection,
                data: payloadTest,
                tableName: testModel.tableName,
            });

            // prepare payload for parts
            let payloadTestPart = await asyncPool(1, parts, (part) => {
                return new Promise(async (resolve, reject) => {
                    try {
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
                        resolve([foundPart.part_id, addedTest.insertId, part]);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            let questionTypeFlat = "";
            const questionTypePrev = [];

            // prepare payload for questions types and map new question types with questions
            let newQuestionWithQuestionType = await asyncPool(1, questions, (question) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let questionType = null;

                        if (questionTypeFlat !== question.question_type) {
                            questionTypeFlat = question.question_type;

                            // Check if question type already exists
                            let foundQuestionType = await Transaction.findOne({
                                tableName: questionTypeModel.tableName,
                                conditions: { type_name: question.question_type },
                                connection,
                            });

                            if (!foundQuestionType) {
                                const payload = {
                                    type_name: question.question_type,
                                };

                                const addedQuestionType = await Transaction.insert({
                                    connection,
                                    data: payload,
                                    tableName: questionTypeModel.tableName,
                                });

                                questionType = {
                                    type_id: addedQuestionType.insertId,
                                    type_name: question.question_type,
                                };
                            } else {
                                questionType = {
                                    type_id: foundQuestionType.type_id,
                                    type_name: foundQuestionType.type_name,
                                };
                            }

                            questionTypePrev.push(questionType);
                        } else {
                            const foundQuestionType = questionTypePrev.find(
                                (t) => t.type_name === question.question_type
                            );
                            questionType = foundQuestionType;
                        }

                        if (!questionType) {
                            throw new NotfoundRequestError(
                                "Không tìm thấy loại câu hỏi",
                                undefined,
                                {
                                    question_type: "Loại câu hỏi không tồn tại",
                                }
                            );
                        }

                        resolve({
                            ...question,
                            questionType,
                        });
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            // prepare payload for questions
            const payloadQuestions = [];

            await asyncPool(1, newQuestionWithQuestionType, (question) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const { questionType, part } = question;

                        const foundPart = payloadTestPart.find((p) => p[2] === part);
                        let group_question_id = null;

                        if (question.group_id) {
                            // prepare payload for group_questions
                            const payload = {
                                group_question_order: question.group_question_order,
                                group_audio: mapValue({
                                    rawValue: question?.uploadAudioCloud,
                                    isJson: true,
                                }),
                                group_image: mapValue({
                                    rawValue: question?.uploadImageCloud,
                                    isJson: true,
                                }),
                                group_text: mapValue({ rawValue: question?.text }),
                                group_transcript: mapValue({ rawValue: question.group_transcript }),
                                test_id: foundPart[1],
                                part_id: foundPart[0],
                                question_type_id: questionType.type_id,
                            };

                            // insert group question
                            const addedGroupQuestion = await Transaction.insert({
                                connection,
                                data: payload,
                                tableName: groupQuestionModel.tableName,
                            });

                            group_question_id = addedGroupQuestion.insertId;

                            // prepare payload for questions in group

                            question.group_questions.forEach((row) => {
                                const payload = {
                                    question_id: currentQuestionIdAutoIncrement + row.order - 1,
                                    question_order: row.order,
                                    question_audio: mapValue({
                                        rawValue: row?.uploadAudioCloud,
                                        isJson: true,
                                    }),
                                    question_image: mapValue({
                                        rawValue: row?.uploadImageCloud,
                                        isJson: true,
                                    }),
                                    question_text: mapValue({
                                        rawValue: row?.text_question,
                                    }),
                                    question_transcript: mapValue({
                                        rawValue: row?.transcript,
                                    }),
                                    question_explain: mapValue({
                                        rawValue: row?.explain,
                                    }),
                                    question_type_id: questionType.type_id,
                                    test_id: foundPart[1],
                                    part_id: foundPart[0],
                                    group_question_id,
                                    answers: row.answers,
                                    tags: row.tags,
                                };

                                payloadQuestions.push(payload);
                            });
                        } else {
                            const payload = {
                                question_id: currentQuestionIdAutoIncrement + question.order - 1,
                                question_order: question.order,
                                question_audio: mapValue({
                                    rawValue: question?.uploadAudioCloud,
                                    isJson: true,
                                }),
                                question_image: mapValue({
                                    rawValue: question?.uploadImageCloud,
                                    isJson: true,
                                }),
                                question_text: mapValue({ rawValue: question?.text_question }),
                                question_transcript: mapValue({ rawValue: question?.transcript }),
                                question_explain: mapValue({ rawValue: question?.explain }),
                                question_type_id: questionType.type_id,
                                test_id: foundPart[1],
                                part_id: foundPart[0],
                                group_question_id: null,
                                answers: question.answers,
                                tags: question.tags,
                            };

                            payloadQuestions.push(payload);
                        }

                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            // insert test to db
            const addedTests = await Transaction.insertBulk({
                connection,
                data: payloadQuestions.map((t) => {
                    const payload = {
                        question_order: t.question_order,
                        question_audio: t.question_audio,
                        question_image: t.question_image,
                        question_text: t.question_text,
                        question_transcript: t.question_transcript,
                        question_explain: t.question_explain,
                        question_type_id: t.question_type_id,
                        test_id: t.test_id,
                        part_id: t.part_id,
                        group_question_id: t.group_question_id,
                    };

                    return Object.values(payload);
                }),
                tableName: questionModel.tableName,
                fields: [
                    "question_order",
                    "question_audio",
                    "question_image",
                    "question_text",
                    "question_transcript",
                    "question_explain",
                    "question_type_id",
                    "test_id",
                    "part_id",
                    "group_question_id",
                ],
            });

            const payloadAnswers = [];
            const payloadQuestionsTags = [];

            await asyncPool(1, payloadQuestions, (question, index) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const questionId = question.question_id;

                        question.answers.forEach((answer) => {
                            const payload = {
                                answer_text: answer.answer_text,
                                answer_isCorrect: answer.answer_isCorrect,
                                answer_order: answer.answer_order,
                                answer_image: null,
                                question_id: questionId,
                            };

                            payloadAnswers.push(Object.values(payload));
                        });

                        await asyncPool(1, question.tags, (tag) => {
                            return new Promise(async (resolve, reject) => {
                                try {
                                    // found tag in db
                                    const foundTag = await Transaction.findOne({
                                        tableName: tagModel.tableName,
                                        conditions: { tag_name: tag },
                                        connection,
                                    });

                                    let payloadAddTag = null;

                                    if (!foundTag) {
                                        // prepare payload for tag
                                        const payload = {
                                            tag_id: generateRandomString(16),
                                            tag_slug: generateSlug(tag),
                                            tag_name: tag,
                                        };

                                        await Transaction.insert({
                                            connection,
                                            data: payload,
                                            tableName: tagModel.tableName,
                                        });

                                        payloadAddTag = {
                                            question_id: questionId,
                                            tag_id: payload.tag_id,
                                        };
                                    } else {
                                        payloadAddTag = {
                                            question_id: questionId,
                                            tag_id: foundTag.tag_id,
                                        };
                                    }

                                    payloadQuestionsTags.push(Object.values(payloadAddTag));

                                    resolve(true);
                                } catch (error) {
                                    reject(error);
                                }
                            });
                        });

                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            await Promise.all([
                Transaction.insertBulk({
                    connection: connection,
                    data: payloadTestPart.map((t) => [t[0], t[1]]),
                    tableName: testPartModel.tableName,
                    fields: ["part_id", "test_id"],
                }),
                Transaction.insertBulk({
                    connection,
                    data: payloadAnswers,
                    tableName: answerModel.tableName,
                    fields: [
                        "answer_text",
                        "answer_isCorrect",
                        "answer_order",
                        "answer_image",
                        "question_id",
                    ],
                }),
                Transaction.insertBulk({
                    connection,
                    data: payloadQuestionsTags,
                    tableName: questionTagModel.tableName,
                    fields: ["question_id", "tag_id"],
                }),
            ]);

            await Transaction.commit(connection);

            const getQuestions = await Transaction.find({
                tableName: questionModel.tableName,
                conditions: { test_id: addedTests.insertId },
                connection,
            });

            return getQuestions;
        } catch (error) {
            console.log(`Error in create new test:::`, error);
            await Transaction.rollback(connection);
            throw error;
        } finally {
            await Transaction.release(connection);
        }
    }
}

module.exports = TestService;
