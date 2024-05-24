import { Request, Response } from "express";
import { Author } from "../models/models";
import { hash, genSalt, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { HOST, PORT, SESSION_SECRET } from "../config";
import { getFileUrl } from "../utils/url";
import { getUserFromRequest } from "../utils/global";

class AuthService {
    async signUp(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const avatarFile = req.file;

            if (!name || !email || !password) {
                return res.status(400).json({ message: "Unprocessable field" });
            }

            const saltRounds = await genSalt(10);
            const passwordHash = await hash(password, saltRounds);

            await Author.create({
                name,
                email,
                password: passwordHash,
                image: avatarFile?.filename
            });

            res.status(200).json({ message: "Success" });   
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async signIn(req: Request, res: Response) {
        let { email, password } = req.body;
        let existingUser;
        let token;

        if (!email || !password) {
            return res.status(400).json({ "message": "Unprocessable field" });
        }

        try {
            existingUser = await Author.findOne({
                where: {
                    email
                }
            });

            if (!existingUser) {
                return res.status(404).json({ "message": "User not found" });
            }
        } catch(error: any) {
            return res.status(500).json({ message: error.message });
        }

        const isValidPassword = await compare(password, existingUser?.dataValues.password);

        if (!existingUser || !isValidPassword) {
            return res.status(401).json({ "message": "Authorization error" });
        }

        try {
            token = jwt.sign(
                {
                    userId: existingUser.dataValues.id,
                    email: existingUser.dataValues.email,
                },
                SESSION_SECRET,
                { expiresIn: "3h" }
            );
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
 
        const image = existingUser.dataValues.image

        res.status(200).json({
            userId: existingUser.dataValues.id,
            email: existingUser.dataValues.email,
            name: existingUser.dataValues.name,
            token,
            image: getFileUrl(image)
        });
    }

    async getMe(req: Request, res: Response) {
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

            res.status(200).json({
                ...user,
                image: getFileUrl(author.dataValues.image),
                name: author.dataValues.name
            });

        } catch (error: any) {
            return res.status(500).json({ message: error.message });   
        }
    }
}

export const authService = new AuthService();