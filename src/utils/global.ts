import { genSalt, hash } from "bcrypt";
import { Request } from "express";

interface IUser {
    userId: number;
    email: string;
}

export function getUserFromRequest(req: Request): IUser {
    const r: any = req;
    return r.user;
}

export async function createPasswordHash(password: string) {
    const saltRounds = await genSalt(10);
    return hash(password, saltRounds);
}