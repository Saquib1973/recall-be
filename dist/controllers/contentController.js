"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const contentSchema_1 = require("../schema/db/contentSchema");
const linkSchema_1 = require("../schema/db/linkSchema");
const helper_1 = require("../utils/helper");
const tagSchema_1 = require("../schema/db/tagSchema");
const contentController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, description, link, tags } = req.body;
            let type = undefined;
            if (link) {
                type = (0, helper_1.findTypeOfContent)(link);
            }
            const sanitizedLink = (link === null || link === void 0 ? void 0 : link.trim()) || undefined;
            let tagIds = [];
            if (tags && tags.length > 0) {
                tagIds = yield Promise.all(tags.map((tag) => __awaiter(this, void 0, void 0, function* () {
                    let tagDoc = yield tagSchema_1.TagModel.findOne({ tag });
                    if (!tagDoc) {
                        tagDoc = yield tagSchema_1.TagModel.create({ tag });
                    }
                    return tagDoc._id;
                })));
            }
            try {
                const doc = yield contentSchema_1.ContentModel.create({
                    title,
                    link: sanitizedLink,
                    tags: tagIds.length > 0 ? tagIds : undefined,
                    description,
                    type,
                    userId: req.userId,
                });
                res.status(200).json({
                    message: 'Document created successfully',
                    doc,
                });
            }
            catch (error) {
                console.error('Error creating document:', error);
                res.status(500).json({
                    message: "Couldn't create document",
                });
            }
        });
    },
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let content = yield contentSchema_1.ContentModel.find({
                    userId: req.userId,
                }).populate('userId', '-password');
                if (!content) {
                    res.status(404).json({
                        message: 'document does not exist',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'Found the document',
                    content,
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Coulcn't get document",
                });
                return;
            }
        });
    },
    getChunk(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { page: no } = req.query;
            const page = parseInt(no);
            const limit = page !== 1 ? 10 : 20;
            if (typeof page !== 'number' || page < 1) {
                res.status(400).json({
                    message: 'Invalid page number',
                });
                return;
            }
            try {
                let content = yield contentSchema_1.ContentModel.find({
                    userId: req.userId,
                })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('userId', '-password')
                    .populate('tags');
                if (!content) {
                    res.status(404).json({
                        message: 'document does not exist',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'Found the document',
                    content,
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Couldn't get document",
                });
                return;
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //TODO: zod validation
            const { contentId } = req.body;
            try {
                const content = yield contentSchema_1.ContentModel.deleteMany({
                    _id: contentId,
                    userId: req.userId,
                });
                if (content.deletedCount <= 0) {
                    res.status(404).json({
                        message: 'No content found to delete or you do not have permission',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'delete doc successful',
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Couldn't delete document",
                });
            }
        });
    },
    getSharedStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const link = yield linkSchema_1.LinkModel.findOne({ userId: req.userId });
                if (!link) {
                    res.status(404).json({
                        message: 'No link found',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'Found the link',
                    link,
                });
            }
            catch (error) {
                res.status(404).json({
                    message: 'No link found',
                });
            }
        });
    },
    share(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { share } = req.body;
            try {
                if (share) {
                    const prev = yield linkSchema_1.LinkModel.findOne({ userId: req.userId });
                    if (!prev) {
                        const link = yield linkSchema_1.LinkModel.create({
                            userId: req.userId,
                            hash: (0, helper_1.generateRandomHash)(10),
                        });
                        res.status(200).json({
                            message: 'created share link',
                            link,
                        });
                    }
                    else {
                        res.status(200).json({
                            message: 'share link already exists',
                            link: prev,
                        });
                        return;
                    }
                }
                else {
                    yield linkSchema_1.LinkModel.deleteOne({
                        userId: req.userId,
                    });
                    res.status(200).json({
                        message: 'deleted share link',
                    });
                }
            }
            catch (error) {
                res.status(404).json({
                    message: 'share link could not be created',
                });
            }
        });
    },
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { q } = req.query;
            if (!q) {
                res.status(400).json({ message: 'Search query is required' });
                return;
            }
            try {
                const results = yield contentSchema_1.ContentModel.find(
                //@ts-ignore
                { $text: { $search: q } }, { score: { $meta: 'textScore' } })
                    .sort({ score: { $meta: 'textScore' } })
                    .populate('userId', '-password')
                    .populate('tags');
                res.status(200).json({ message: 'Search results', results });
                return;
            }
            catch (error) {
                console.error('Error searching:', error);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
        });
    },
    sharedRecall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { hash } = req.params;
            console.log(hash);
            try {
                const link = yield linkSchema_1.LinkModel.findOne({ hash });
                if (!link) {
                    res.status(404).json({
                        message: 'No link found',
                    });
                    return;
                }
                console.log(link);
                try {
                    if (!(link === null || link === void 0 ? void 0 : link.userId)) {
                        res.status(404).json({
                            message: 'No link found',
                        });
                        return;
                    }
                    let content = yield contentSchema_1.ContentModel.find({
                        userId: link === null || link === void 0 ? void 0 : link.userId,
                    }).populate('userId', '-password');
                    if (!content) {
                        res.status(404).json({
                            message: 'document does not exist',
                        });
                        return;
                    }
                    res.status(200).json({
                        message: 'Found the document',
                        content,
                    });
                }
                catch (error) {
                    res.status(404).json({
                        message: "Coulcn't get document",
                    });
                }
            }
            catch (error) {
                res.status(404).json({
                    message: 'No link found',
                });
            }
        });
    },
    getRecallProtected(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let { id } = req.params;
            try {
                const content = yield contentSchema_1.ContentModel.findOne({ _id: id });
                if (((_a = content === null || content === void 0 ? void 0 : content.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== req.userId) {
                    res.status(403).json({
                        message: 'You are not authorized to view this document',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'Found the document',
                    content,
                });
            }
            catch (error) {
                res.status(404).json({
                    message: 'No link found',
                });
                return;
            }
        });
    },
    getRecallOpen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
};
exports.default = contentController;
