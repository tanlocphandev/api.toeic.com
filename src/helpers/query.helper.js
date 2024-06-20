"use strict";

class QueryHelper {
    static getPagination(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;
        let _query = {};
        let order = {};

        if (query.query) {
            const queryString = String(query.query).split(";");

            queryString.forEach((q) => {
                const [key, value] = q.split("=");
                _query[key] = value;
            });
        }

        if (query.order) {
            const [key, value] = String(query.order).split(",");
            order = { key: key, value: value?.toUpperCase() || "ASC" };
        }

        return { page, limit, offset, query: _query, order };
    }
}

module.exports = QueryHelper;
