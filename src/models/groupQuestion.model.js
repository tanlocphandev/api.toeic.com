"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");

class GroupQuestionDao extends SoftDeleteModel {
    constructor({
        group_id,
        group_question_order,
        group_audio,
        group_image,
        group_text,
        group_transcript,
        test_id,
        part_id,
        question_type_id,
        created_at,
        updated_at,
        deleted_at,
    }) {
        super({ created_at, updated_at, deleted_at });

        this.group_id = group_id;
        this.group_question_order = group_question_order;
        this.group_audio = group_audio;
        this.group_image = group_image;
        this.group_text = group_text;
        this.group_transcript = group_transcript;

        this.test_id = test_id;
        this.part_id = part_id;
        this.question_type_id = question_type_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                group_id: 1,
                group_question_order: 1,
                group_audio: 1,
                group_image: 1,
                group_text: 1,
                group_transcript: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class GroupQuestionModel extends BaseModel {
    get tableName() {
        return "group_questions";
    }

    get idColumn() {
        return "group_id";
    }

    async findById(groupId) {
        const response = await super.findOne({ group_id: groupId });

        if (!response) return null;

        return new GroupQuestionDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: GroupQuestionDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new GroupQuestionDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { GroupQuestionDao, groupQuestionModel: new GroupQuestionModel() };
