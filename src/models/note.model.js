"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const { noteDetailsModel } = require("./noteDetails.model");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class NoteDao extends TimestampModel {
    constructor({ note_id, note_name, user_id, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.note_id = note_id;
        this.note_name = note_name;
        this.user_id = user_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                note_id: 1,
                note_name: 1,
                user_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class NoteModel extends BaseModel {
    get tableName() {
        return "notes";
    }

    get idColumn() {
        return "note_id";
    }

    async findByName(name) {
        const response = await super.findOne({ note_name: name });

        if (!response) return null;

        return new NoteDao(response);
    }

    async findById(noteId) {
        const response = await super.findOne({ note_id: noteId });

        if (!response) return null;

        let result = new NoteDao(response);

        if (!withInclude) return result;

        result = await this._findInclude(result);

        return result;
    }

    async _findInclude(data) {
        const { results: noteDetails } = await noteDetailsModel.find({
            query: `note_id:${data.note_id}`,
            all: "true",
        });

        return { ...data, noteDetails };
    }

    async _findIncludes(data = []) {
        const response = await Promise.all(
            data.map(async (row) => {
                const { results: noteDetails } = await noteDetailsModel.find({
                    query: `note_id:${row.note_id}`,
                    all: "true",
                });

                return { ...row, noteDetails };
            })
        );
        return response;
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll, withInclude } =
            QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: NoteDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new NoteDao(row));

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

        let results = data.map((row) => new NoteDao(row));

        if (withInclude) results = await this._findIncludes(results);

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { NoteDao, noteModel: new NoteModel() };
