"use strict";

const { mapperSelect } = require("../utils");
const BaseModel = require("./base.model");
const { userModel } = require("./user.model");
const TimestampModel = require("./common/timestamp.model");

class CommentDao extends TimestampModel {
    constructor({
        comment_id,
        comment_content,
        comment_left,
        comment_right,
        comment_parentId,
        comment_status,
        user_id,
        test_id,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.comment_id = comment_id;
        this.comment_content = comment_content;
        this.comment_left = comment_left;
        this.comment_right = comment_right;
        this.comment_parentId = comment_parentId;
        this.comment_status = comment_status;
        this.test_id = test_id;
        this.user_id = user_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                comment_id: 1,
                comment_content: 1,
                comment_left: 1,
                comment_right: 1,
                comment_parentId: 1,
                comment_status: 1,
                test_id: 1,
                user_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class CommentModel extends BaseModel {
    get tableName() {
        return "comments";
    }

    get idColumn() {
        return "comment_id";
    }

    async findById(commentId) {
        const response = await super.findOne({ comment_id: commentId });

        if (!response) return null;

        let result = new CommentDao(response);

        return result;
    }

    /**
     *
     * @param {number | string} testId
     * @returns {Promise<number>}
     */
    async findMaxRight(testId) {
        const response = await super.findOne(
            { test_id: testId },
            {
                key: "comment_right",
                value: "DESC",
            }
        );

        if (!response) return 0;

        return response.comment_right;
    }

    async _findIncludes(data = []) {
        const response = await Promise.all(
            data.map(async (row) => {
                const user = await userModel.findById(row.user_id);

                return {
                    ...row,
                    user: mapperSelect(user, ["user_id", "user_fullName", "user_avatar"]),
                };
            })
        );

        return response;
    }
}

module.exports = { CommentDao, commentModel: new CommentModel() };
