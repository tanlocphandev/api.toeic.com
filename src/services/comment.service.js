"use strict";

const { NotfoundRequestError, AuthFailureError } = require("../core/error.response");
const MysqlHelper = require("../helpers/mysql.helper");
const { commentModel } = require("../models/comment.model");
const { testModel } = require("../models/test.model");
const _ = require("lodash");

class CommentService {
    static async create({ testId, userId, content, parentCommentId = null }) {
        const comment = {
            test_id: testId,
            user_id: userId,
            comment_content: content,
            comment_parentId: parentCommentId,
        };

        let rightValue;

        if (parentCommentId) {
            // find parent comment
            const parentComment = await commentModel.findById(parentCommentId);

            if (!parentComment) {
                throw new NotfoundRequestError("Không tìm thấy bình luận cha");
            }

            rightValue = parentComment.comment_right;

            // updateMany comments
            await Promise.all([
                commentModel.updateMany(
                    { comment_right: MysqlHelper.gte(rightValue), test_id: testId },
                    { comment_right: MysqlHelper.inc("comment_right", 2) }
                ),
                commentModel.updateMany(
                    { comment_left: MysqlHelper.gt(rightValue), test_id: testId },
                    { comment_left: MysqlHelper.inc("comment_left", 2) }
                ),
            ]);
        } else {
            const maxRight = await commentModel.findMaxRight(testId);

            rightValue = maxRight + 1;
        }

        // console.log("====================================");
        // console.log(`rightValue:::`, rightValue);
        // console.log("====================================");

        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        // console.log("====================================");
        // console.log(`new comment:::`, comment);
        // console.log("====================================");

        const newComment = await commentModel.insert(comment);

        return newComment.insertId;
    }

    static async checkOwn({ commentId, userId }) {
        const foundComment = await commentModel.findOne({
            comment_id: commentId,
            user_id: userId,
        });

        if (!foundComment) {
            throw new AuthFailureError(`Bạn không có quyền truy cập!`);
        }

        return foundComment;
    }

    static async updateComment(commentId, body) {
        if (_.isEmpty(body)) return 0;

        const foundComment = await commentModel.findById(commentId);

        if (!foundComment) {
            throw new NotfoundRequestError("Không tìm thấy bình luận");
        }

        if (body.comment_status) {
            const leftValue = foundComment.comment_left,
                rightValue = foundComment.comment_right;

            // updateMany comments
            await commentModel.updateMany(
                {
                    comment_left: MysqlHelper.query(
                        `>= ${leftValue} AND \`comment_left\` <= ${rightValue}`
                    ),
                    test_id: foundComment.test_id,
                },
                {
                    comment_status: body.comment_status,
                }
            );

            return 1;
        }

        const updatedComment = await commentModel.updateById(commentId, body);

        return updatedComment.affectedRows;
    }

    static async getCommentsByParentId({ testId, parentCommentId = null, include = null }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId);

            if (!parent) {
                throw new NotfoundRequestError("Không tìm thấy bình luận cha");
            }

            let comments = await commentModel.find(
                {
                    test_id: testId,
                    comment_left: MysqlHelper.gt(parent.comment_left),
                    comment_right: MysqlHelper.lte(parent.comment_right),
                    comment_parentId: parentCommentId,
                },
                {
                    key: "comment_left",
                    value: "ASC",
                }
            );

            comments = await commentModel._countChildren(comments);

            if (!include) {
                return comments;
            }

            const results = await commentModel._findIncludes(comments);

            return results;
        }

        let comments = await commentModel.find(
            {
                test_id: testId,
                comment_parentId: MysqlHelper.isNull(),
            },
            {
                key: "comment_left",
                value: "ASC",
            }
        );

        comments = await commentModel._countChildren(comments);

        if (!include) {
            return comments;
        }

        const results = await commentModel._findIncludes(comments);

        return results;
    }

    static async deleteComment({ commentId, testId }) {
        // check test exists
        const foundTest = await testModel.findById(testId);

        if (!foundTest) {
            throw new NotfoundRequestError("Không tìm thấy đề thi!");
        }

        // 1. Xác định giá trị left và right của comment đang xóa
        const foundComment = await commentModel.findById(commentId);

        if (!foundComment) {
            throw new NotfoundRequestError("Không tìm thấy bình luận!");
        }

        const leftValue = foundComment.comment_left,
            rightValue = foundComment.comment_right,
            width = rightValue - leftValue + 1; // 2. Tính chieu rong cua comment đang xóa

        // console.log("====================================");
        // console.log({ leftValue, rightValue, width, foundComment });
        // console.log("====================================");

        // 3. Xóa all comments con
        await commentModel.deleteMany({
            comment_left: MysqlHelper.query(
                `>= ${leftValue} AND \`comment_left\` <= ${rightValue}`
            ),
            test_id: testId,
        });

        // 4. Cập nhật giá trị left và right còn lại
        await Promise.all([
            commentModel.updateMany(
                { comment_right: MysqlHelper.gt(rightValue), test_id: testId },
                { comment_right: MysqlHelper.decrease("comment_right", width) }
            ),
            commentModel.updateMany(
                { comment_left: MysqlHelper.gt(rightValue), test_id: testId },
                { comment_left: MysqlHelper.decrease("comment_left", width) }
            ),
        ]);

        return true;
    }
}

module.exports = CommentService;
