"use strict";

const CommentService = require("../services/comment.service");
const { Created, OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
const { checkOwn } = require("../helpers/auth.helper");
const { commentModel } = require("../models/comment.model");

class CommentController {
    createComment = async (req, res) => {
        const { userId } = req.user;

        new Created({
            message: "Create new comment success",
            metadata: await CommentService.create({ ...req.body, userId }),
        }).send(res);
    };

    updateComment = async (req, res) => {
        const { comment_content = "" } = req.body;

        await checkOwn({
            key: "comment_id",
            value: req.params.commentId,
            userId: req.user.userId,
            model: commentModel,
        });

        if (!comment_content) {
            return new OK({
                message: "Update comment success",
                metadata: 0,
            }).send(res);
        }

        new OK({
            message: "Update comment success",
            metadata: await CommentService.updateComment(req.params.commentId, { comment_content }),
        }).send(res);
    };

    updateStatusComment = async (req, res) => {
        const { comment_status = "" } = req.body;

        if (!comment_status) {
            return new OK({
                message: "Update status comment success",
                metadata: 0,
            }).send(res);
        }

        new OK({
            message: "Update status comment success",
            metadata: await CommentService.updateComment(req.params.commentId, { comment_status }),
        }).send(res);
    };

    getCommentsByParentId = async (req, res) => {
        if (!req.query.testId) {
            throw new BadRequestError("Mã đề thi là bằt buộc");
        }

        new OK({
            message: "Get comments success",
            metadata: await CommentService.getCommentsByParentId(req.query),
        }).send(res);
    };

    deleteComment = async (req, res) => {
        await checkOwn({
            key: "comment_id",
            value: req.body.commentId,
            userId: req.user.userId,
            model: commentModel,
        });

        new OK({
            message: "Delete comment success",
            metadata: await CommentService.deleteComment(req.body),
        }).send(res);
    };
}

module.exports = new CommentController();
