import { NextFunction, Request, Response } from "express";
import { getServerUrl } from "../../utils/url";

export function requestMiddleware(req: Request, _: Response, next: NextFunction) {
    console.log("\x1b[32m", `[${req.method}] - ${getServerUrl()}/${req.path}`);
    next();
}