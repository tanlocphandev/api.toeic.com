"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class NoteDetailsDao extends TimestampModel {
    constructor({ detail_id, detail_title, detail_content, note_id, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.detail_id = detail_id;
        this.detail_title = detail_title;
        this.detail_content = detail_content;
        this.note_id = note_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                detail_id: 1,
                detail_title: 1,
                detail_content: 1,
                note_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class NoteDetailsModel extends BaseModel {
    get tableName() {
        return "note_details";
    }

    get idColumn() {
        return "detail_id";
    }

    async findById(detailId, withInclude) {
        const response = await super.findOne({ detail_id: detailId });

        if (!response) return null;

        let result = new NoteDetailsDao(response);

        if (!withInclude) return result;

        result = await this._findInclude(result);

        return result;
    }

    async _findInclude(data) {
        const note = await super.findOne({ note_id: data.note_id }, null, "notes");

        if (!note) return null;

        return { ...data, note };
    }

    async _findIncludes(data = []) {
        const response = await Promise.all(
            data.map(async (row) => {
                const note = await super.findOne({ note_id: row.note_id }, null, "notes");

                if (!note) return null;

                return { ...row, note };
            })
        );

        return response;
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll, withInclude } =
            QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: NoteDetailsDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new NoteDetailsDao(row));

            if (withInclude) results = await this._findIncludes(results);

            return { results, pagination: null };
        }

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        let results = data.map((row) => new NoteDetailsDao(row));

        if (withInclude) results = await this._findIncludes(results);

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { NoteDetailsDao, noteDetailsModel: new NoteDetailsModel() };
