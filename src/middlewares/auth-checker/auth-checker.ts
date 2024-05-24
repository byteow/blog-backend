import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { SESSION_SECRET } from "../../config";
import { unprotectedMethods } from "./methods";

export function authChecker(req: Request, res: Response, next: NextFunction) {
    console.log(req.path);
    if (unprotectedMethods.includes(req.path)) {
        return next();
    }
    
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
        return res.status(401).json({ message: 'Authorization error' });
    }

    try {
        const payload = jwt.verify(accessToken, SESSION_SECRET);
        const r: any = req;
        r.user = payload;

        req = r;
        next();    
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
    
}