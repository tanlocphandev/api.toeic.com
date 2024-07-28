"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { filterPropOutsideInstance } = require("../utils");

class DocumentDao extends TimestampModel {
    constructor({
        doc_id,
        doc_title,
        doc_desc,
        doc_slug,
        doc_type,
        doc_audio,
        doc_video,
        doc_text,
        doc_pdf,
        doc_link,
        doc_thumbnail,
        doc_status,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.doc_id = doc_id;
        this.doc_title = doc_title;
        this.doc_desc = doc_desc;
        this.doc_slug = doc_slug;
        this.doc_type = doc_type;
        this.doc_audio = doc_audio;
        this.doc_video = doc_video;
        this.doc_text = doc_text;
        this.doc_pdf = doc_pdf;
        this.doc_link = doc_link;
        this.doc_thumbnail = doc_thumbnail;
        this.doc_status = doc_status;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                doc_id: 1,
                doc_title: 1,
                doc_desc: 1,
                doc_slug: 1,
                doc_type: 1,
                doc_audio: 1,
                doc_video: 1,
                doc_text: 1,
                doc_pdf: 1,
                doc_link: 1,
                doc_thumbnail: 1,
                doc_status: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class DocumentModel extends BaseModel {
    get tableName() {
        return "documents";
    }

    get idColumn() {
        return "doc_id";
    }

    async findById(docId, withInclude = false) {
        const response = await super.findOne({ doc_id: docId });

        if (!response) return null;

        const result = new DocumentDao(response);

        if (!withInclude) return result;

        // Get sections;
        return { ...result };
    }

    async findOne(conditions) {
        const response = await super.findOne(conditions);

        if (!response) return null;

        return new DocumentDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll, withInclude } =
            QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: DocumentDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new DocumentDao(row));

            if (withInclude) {
                // get sections of document;
            }

            return { results, pagination: null };
        }

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        let results = data.map((row) => new DocumentDao(row));

        if (withInclude) {
            // get sections of document;
        }

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { DocumentDao, documentModel: new DocumentModel() };
