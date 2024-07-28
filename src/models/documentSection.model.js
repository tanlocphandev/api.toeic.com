"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { filterPropOutsideInstance } = require("../utils");
const { documentModel } = require("./document.model");

class DocumentSectionDao extends TimestampModel {
    constructor({
        section_id,
        section_title,
        section_link,
        section_video,
        section_audio,
        section_status,
        doc_id,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.doc_id = doc_id;
        this.section_id = section_id;
        this.section_title = section_title;
        this.section_link = section_link;
        this.section_video = section_video;
        this.section_audio = section_audio;
        this.section_status = section_status;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                section_id: 1,
                section_title: 1,
                section_link: 1,
                section_video: 1,
                section_audio: 1,
                section_status: 1,
                doc_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class DocumentSectionModel extends BaseModel {
    get tableName() {
        return "document_sections";
    }

    get idColumn() {
        return "section_id";
    }

    async findById(sectionId, withInclude = false) {
        const response = await super.findOne({ section_id: sectionId });

        if (!response) return null;

        const result = new DocumentSectionDao(response);

        if (!withInclude) return result;

        // get document
        const document = await documentModel.findById(result.doc_id);

        return { ...result, document };
    }

    async findOne(conditions) {
        const response = await super.findOne(conditions);

        if (!response) return null;

        return new DocumentSectionDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll, withInclude } =
            QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: DocumentSectionDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new DocumentSectionDao(row));

            if (withInclude) {
                // get sections of document;
                results = await Promise.all(
                    results.map(async (row) => {
                        const document = await documentModel.findById(row.doc_id);
                        return { ...row, document };
                    })
                );
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

        let results = data.map((row) => new DocumentSectionDao(row));

        if (withInclude) {
            // get sections of document;
            results = await Promise.all(
                results.map(async (row) => {
                    const document = await documentModel.findById(row.doc_id);
                    return { ...row, document };
                })
            );
        }

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { DocumentSectionDao, documentSectionModel: new DocumentSectionModel() };
