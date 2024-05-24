import { Request, Response } from "express";
import { createPasswordHash, getUserFromRequest } from "../utils/global";
import { Author } from "../models/models";
import { getFileUrl } from "../utils/url";
import { unlinkSync } from "fs";
import { STATIC_DIR_PATH } from "../config";
import { join } from "path";

class AuthorService {
    async updateAuthor(req: Request, res: Response) {
        const user = getUserFromRequest(req);
        const { email, name, password } = req.body;
        const avatar = req.file;

        const fieldsForUpdate: Record<string, string> = {};

        if (password) {
            fieldsForUpdate.password = await createPasswordHash(password);
        }

        if (name) {
            fieldsForUpdate.name = name;
        }

        if (email) {
            fieldsForUpdate.email = email;
        }

        if (avatar) {
            fieldsForUpdate.image = avatar.filename;

            try {
                const author = await Author.findOne({
                    where: {
                        id: user.userId
                    }
                });

                if (!author) {
                    return res.status(404).json({ message: "User not found" });
                }

                const prevImage = author.dataValues.image;
                unlinkSync(join(STATIC_DIR_PATH, prevImage));
            } catch (error: any) {
                res.status(500).json({ message: error.message })
            }
        }

        try {
            await Author.update(fieldsForUpdate, {
                where: {
                    id: user.userId
                }
            });

            res.status(200).json({ message: "Success" });
        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    }

    async deleteAuthor(req: Request, res: Response) {
        const user = getUserFromRequest(req);

        try {   
            const author = await Author.findOne({
                where: {
                    id: user.userId
                }
            });

            if (!author) {
                return res.status(404).json({ "message": "User not found" });
            }
            
            await Author.destroy({
                where: {
                    id: user.userId
                }
            });
            res.status(200).json({ "message": "Success" });
        } catch (error: any) {
            res.status(500).json({ "message": error.message });
        }
    }

    async getAuthor(req: Request, res: Response) {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "Unprocessable field" });
        }

        try {
            const author = await Author.findOne({
                where: {
                    id
                }
            });

            if (!author) {
                return res.status(404).json({ message: "User not found" });
            }

            const data = author.dataValues;
            delete data.password;
            delete data.updatedAt;

            res.status(200).json({
                ...data,
                image: getFileUrl(data.image)
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const authorService = new AuthorService();