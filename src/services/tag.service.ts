import { Request, Response } from "express";
import { getUserFromRequest } from "../utils/global";
import { Tag } from "../models/models";

class TagService {
    async createTag(req: Request, res: Response) {
        const { name } = req.body;
        const { userId } = getUserFromRequest(req);

        if (!name) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const hashName = `#${name}`;

            const data = { userId, hashName };
            await Tag.create(data);

            const tag = await Tag.findOne({
                where: { hashName }
            });

            if (!tag) {
                return res.status(404).json({ message: "Tag not found" });
            }

            res.status(200).json({
                ...data,
                id: tag?.dataValues.id
            });

        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async deleteTag(req: Request, res: Response) {
        const { id } = req.body;
        const { userId } = getUserFromRequest(req);

        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const tag = await Tag.findOne({
                where: { id }
            });

            if (!tag) {
                return res.status(404).json({ message: "Tag not found" });
            }

            if (tag.dataValues.userId !== userId) {
                return res.status(403).json({ message: "Forbiden" });
            }

            await Tag.destroy({
                where: { id }
            });

            res.status(200).json({ message: "Success" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateTag(req: Request, res: Response) {
        const { userId } = getUserFromRequest(req);
        const { name, id } = req.body;

        if (!name || !id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const tag = await Tag.findOne({
                where: { id }
            });
            const hashName = `#${name}`;

            if (!tag) {
                return res.status(404).json({ message: "Tag not found" });
            }

            if (tag.dataValues.userId !== userId) {
                return res.status(403).json({ message: "Forbiden" });
            }

            await Tag.update({ hashName }, {
                where: { id }
            });

            res.status(200).json({ id, userId, hashName });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTag(req: Request, res: Response) {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const tag = await Tag.findOne({
                where: { id }
            });

            if (!tag) {
                return res.status(404).json({ message: "Tag not found" });
            }

            res.status(200).json(tag);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTags(req: Request, res: Response) {
        const { limit, query } = req.query;

        const _limit = parseInt(limit?.toString() || '100');

        if (_limit > 200 || _limit < 2) {
            return res.status(400).json({ message: "Limit cannot be more that 200 and less that 2 categories" });
        }

        try {
            let results = [];
            const searchQuery = `#${query?.toString()}`;

            if (!query) {
                results = await Tag.findAll({
                    limit: _limit
                });
            
            } else {
                results = await Tag.findAll({
                    limit: _limit,
                    where: {
                        hashName: searchQuery
                    }
                });
            }

            res.status(200).json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const tagService = new TagService();