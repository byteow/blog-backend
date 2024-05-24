import { Request, Response } from "express";
import { getUserFromRequest } from "../utils/global";
import { Post } from "../models/models";
import { unlinkSync } from "fs";
import { join } from "path";
import { STATIC_DIR_PATH } from "../config";
import { getFileUrl } from "../utils/url";

class PostService {
    async createPost(req: Request, res: Response) {
        const { title, body, categoryId, tagsIds } = req.body;
        const postImage = req.file;
        const user = getUserFromRequest(req);

        let tags = [];

        if (!title || !body || !categoryId || !tagsIds) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        if (postImage && tagsIds) {
            tags = JSON.parse(tagsIds);
        } else {
            tags = tagsIds;
        }

        try {
            const postData = {
                title, body,
                categoryId: parseInt(categoryId),
                tagsIds: tags,
                authorId: user.userId,
                image: postImage?.filename 
             }

            await Post.create(postData);
            res.status(200).json(postData);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deletePost(req: Request, res: Response) {
        const { id } = req.body;
        const { userId } = getUserFromRequest(req);
        
        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const post = await Post.findOne({
                where: {
                    id
                }
            });

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            if (post.dataValues.authorId !== userId) {
                return res.status(403).json({ message: "Forbiden" });
            }
            unlinkSync(join(STATIC_DIR_PATH, post.dataValues.image));

            await Post.destroy({
                where: {
                    id
                }
            });

            res.status(200).json({ message: "Success" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updatePost(req: Request, res: Response) {
        const { userId } = getUserFromRequest(req);
        const { tagsIds, id } = req.body;
        
        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        const postImage = req.file;
        const notAvalibleFields = ['id', 'createdAt', 'updatedAt', 'authorId'];
        const fieldsForUpdate: Record<any, any> = {};

        for (let [key, val] of Object.entries(req.body)) {
            if (notAvalibleFields.includes(key)) continue;

            fieldsForUpdate[key] = val;
        }

        if (postImage) {
            if (tagsIds) {
                fieldsForUpdate.tagsIds = JSON.parse(tagsIds);
            }

            fieldsForUpdate.image = postImage.filename;
        }

        try {
            const post = await Post.findOne({
                where: { id }
            });

            if (!post) {
                return res.status(404).json({ message: "Category not found" });
            }

            if (post.dataValues.authorId !== userId) {
                return res.status(403).json({ message: "Forbiden" });
            }

            await Post.update(fieldsForUpdate, {
                where: { id }
            });

            res.status(200).json({ message: "Success" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPost(req: Request, res: Response) {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const post = await Post.findOne({
                where: {
                    id
                }
            });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }

            return res.status(200).json({
                ...post.dataValues,
                image: getFileUrl(post.dataValues.image)
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getPosts(req: Request, res: Response) {
        const { limit, query } = req.query;
        const _limit = parseInt(limit?.toString() || '100');

        if (_limit > 200 || _limit < 2) {
            return res.status(400).json({ message: "Limit cannot be more that 200 and less that 2 posts" });
        }

        try {
            let results = [];

            if (!query) {
                results = await Post.findAll({
                    limit: _limit
                });
            
            } else {
                results = await Post.findAll({
                    limit: _limit,
                    where: {
                        title: query.toString()
                    }
                })
            }

            results = results.map(post => {
                return {
                    ...post.dataValues,
                    image: getFileUrl(post.dataValues.image)
                } 
            });

            res.status(200).json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const postService = new PostService();