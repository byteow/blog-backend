import { Request, Response } from "express";
import { getUserFromRequest } from "../utils/global";
import { Category } from "../models/models";

class CategoryService {
    async createCategory(req: Request, res: Response) {
        const { name } = req.body;
        const { userId } = getUserFromRequest(req);

        if (!name) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const data = { name, userId };

            await Category.create(data);

            const category = await Category.findOne({
                where: {
                    name
                }
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({
                ...data,
                id: category?.dataValues.id
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCategory(req: Request, res: Response) {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const category = await Category.findOne({
                where: {
                    id
                }
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json(category);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateCategory(req: Request, res: Response) {
        const { userId } = getUserFromRequest(req);
        const { name, id } = req.body;

        if (!name || !id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const category = await Category.findOne({
                where: {
                    id
                }
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            if (category.dataValues.userId !== userId) {
                return res.status(403).json({ message: "Forbiden" });
            }

            await Category.update({ name }, {
                where: { 
                    id
                }
            });

            res.status(200).json({
                id, userId, name
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteCategory(req: Request, res: Response) {
        const { id } = req.body;
        const { userId } = getUserFromRequest(req);

        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const category = await Category.findOne({
                where: {
                    id
                }
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            if (category.dataValues.userId !== userId) {
                return res.status(403).json({ message: "Forbiden" });
            }

            await Category.destroy({
                where: {
                    id
                }
            });

            res.status(200).json({ message: "Success" });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCategories(req: Request, res: Response) {
        const { limit, query } = req.query;
        
        const _limit = parseInt(limit?.toString() || '100');

        if (_limit > 200 || _limit < 2) {
            return res.status(400).json({ message: "Limit cannot be more that 200 and less that 2 categories" });
        }

        try {
            let results = [];

            if (!query) {
                results = await Category.findAll({
                    limit: _limit
                });
            
            } else {
                results = await Category.findAll({
                    limit: _limit,
                    where: {
                        name: query.toString()
                    }
                })
            }

            res.status(200).json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const categoryService = new CategoryService();