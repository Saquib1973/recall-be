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
const tagSchema_1 = require("../schema/db/tagSchema");
const helper_1 = require("../utils/helper");
const contentController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { title, description, link, tags } = req.body;
            if (!title && !link) {
                res.status(400).json({
                    message: 'Nothing to Recall',
                });
                return;
            }
            //if link is given determine the type of link
            let type;
            if (link) {
                type = (0, helper_1.ContentType)(link.trim());
            }
            //storing tags
            let tagIds = []; //stores ids of all tags (Created and also Already existing ones);
            if (tags && tags.length > 0) {
                tagIds = yield Promise.all(tags.map((tag) => __awaiter(this, void 0, void 0, function* () {
                    tag = tag.trim().toLowerCase();
                    let tagResponse = yield tagSchema_1.TagModel.findOne({ tag });
                    if (!tagResponse) {
                        tagResponse = yield tagSchema_1.TagModel.create({ tag });
                    }
                    return tagResponse._id;
                })));
            }
            //Create the content
            try {
                const doc = yield contentSchema_1.ContentModel.create({
                    title,
                    link,
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
                })
                    .populate('userId', '-password')
                    .sort({ createdAt: -1 });
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
    recallChunks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { query: { page: no }, userId, } = req;
            const page = parseInt(no); // some ts error still have to study about this
            const limit = 10;
            if (typeof page !== 'number' || page < 1 || !no) {
                res.status(400).json({
                    message: 'Invalid page number',
                });
                return;
            }
            try {
                let content = yield contentSchema_1.ContentModel.find({ userId })
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('userId', '-password')
                    .populate('tags');
                const length = content.length;
                if (!content || length === 0) {
                    res.status(404).json({
                        message: 'document does not exist',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'Found the recall',
                    length,
                    content,
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Couldn't get recall",
                });
                return;
            }
        });
    },
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body: { contentId: _id }, userId, } = req;
            try {
                const content = yield contentSchema_1.ContentModel.deleteMany({ _id, userId });
                if (content.deletedCount <= 0) {
                    res.status(404).json({
                        message: 'No recall was found to delete or you do not have permission',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'deleted recall successfully',
                });
            }
            catch (error) {
                res.status(404).json({
                    message: "Couldn't delete recall",
                });
            }
        });
    },
    sharedRecallStatus(req, res) {
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
            const { body: { share }, userId, } = req;
            try {
                if (share) {
                    const prev = yield linkSchema_1.LinkModel.findOne({ userId });
                    if (!prev) {
                        const link = yield linkSchema_1.LinkModel.create({
                            userId,
                            hash: (0, helper_1.generateHash)(10),
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
            //search query
            const q = req.query.q;
            //if no search query we do early return
            if (!q) {
                res.status(400).json({ message: 'Search query is required' });
                return;
            }
            try {
                const regex = new RegExp(q, 'i'); // 'i' for case-insensitive
                const results = yield contentSchema_1.ContentModel.find({
                    $or: [{ title: regex }, { description: regex }, { link: regex }],
                    userId: req.userId,
                })
                    .sort({ createdAt: -1 })
                    .populate('userId', '-password')
                    .populate('tags');
                console.log(q);
                console.log(results);
                console.log(req.userId);
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
    sharedRecallChunks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { hash } = req.params;
            try {
                // first find the link in link model
                const link = yield linkSchema_1.LinkModel.findOne({ hash });
                if (!link) {
                    res.status(404).json({
                        message: 'No link found',
                    });
                    return;
                }
                try {
                    if (!(link === null || link === void 0 ? void 0 : link.userId)) {
                        res.status(404).json({
                            message: 'No link found',
                        });
                        return;
                    }
                    let { query: { page: no }, } = req;
                    const page = parseInt(no);
                    const limit = 10;
                    if (typeof page !== 'number' || page < 1 || !no) {
                        res.status(400).json({
                            message: 'Invalid page number',
                        });
                        return;
                    }
                    //now from the link response gather the recalls of link.userId
                    let content = yield contentSchema_1.ContentModel.find({
                        userId: link === null || link === void 0 ? void 0 : link.userId,
                    })
                        .sort({ createdAt: -1 })
                        .skip((page - 1) * limit)
                        .limit(limit)
                        .populate('userId', '-password')
                        .populate('tags');
                    const length = content.length;
                    if (!content || length === 0) {
                        res.status(404).json({
                            message: 'document does not exist',
                        });
                        return;
                    }
                    res.status(200).json({
                        message: 'Found the recall',
                        length,
                        content,
                    });
                }
                catch (error) {
                    res.status(404).json({
                        message: "Coulcn't get recall",
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
    recall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let { params: { id: _id }, userId, } = req;
            try {
                const content = yield contentSchema_1.ContentModel.findOne({ _id });
                if (((_a = content === null || content === void 0 ? void 0 : content.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
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
            }
        });
    },
    sharedRecall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let { query: { link, id }, } = req;
            try {
                const linkResponse = yield linkSchema_1.LinkModel.findOne({ hash: link });
                if (!linkResponse) {
                    res.status(404).json({
                        message: 'No link found',
                    });
                    return;
                }
                const content = yield contentSchema_1.ContentModel.findOne({ _id: id });
                if (!content) {
                    res.status(404).json({
                        message: 'No content found',
                    });
                    return;
                }
                if (linkResponse.userId.toString() !== (content === null || content === void 0 ? void 0 : content.userId.toString())) {
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
            }
        });
    },
    updateRecall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let { params: { id: _id }, userId, body: { title, description, link, tags }, } = req;
            // Define options for findByIdAndUpdate
            const options = { new: true, runValidators: true };
            let type;
            if (link) {
                type = (0, helper_1.ContentType)(link.trim());
            }
            // Store tags
            let tagIds = [];
            if (tags && tags.length > 0) {
                tagIds = yield Promise.all(tags.map((tag) => __awaiter(this, void 0, void 0, function* () {
                    tag = tag.trim().toLowerCase();
                    let tagResponse = yield tagSchema_1.TagModel.findOne({ tag });
                    if (!tagResponse) {
                        tagResponse = yield tagSchema_1.TagModel.create({ tag });
                    }
                    return tagResponse._id;
                })));
            }
            try {
                const contentt = yield contentSchema_1.ContentModel.findOne({ _id });
                if (((_a = contentt === null || contentt === void 0 ? void 0 : contentt.userId) === null || _a === void 0 ? void 0 : _a.toString()) !== userId) {
                    res.status(403).json({
                        message: 'You are not authorized to view this document',
                    });
                    return;
                }
                const content = yield contentSchema_1.ContentModel.findByIdAndUpdate(_id, {
                    title,
                    description,
                    link,
                    tags: tagIds.length > 0 ? tagIds : undefined,
                    type,
                }, options);
                if (!content) {
                    res.status(404).json({
                        message: 'No content found',
                    });
                    return;
                }
                res.status(200).json({
                    message: 'Content updated successfully',
                    content,
                });
            }
            catch (error) {
                console.error('Error updating content:', error);
                res.status(500).json({
                    message: "Couldn't update content",
                });
            }
        });
    }
};
exports.default = contentController;
