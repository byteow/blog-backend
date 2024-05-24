import { Router } from "express";
import { existsSync } from "fs";
import { join } from "path";
import { STATIC_DIR_PATH } from "../config";

export const fileRouter = Router();

fileRouter.get('/file', (req, res) => {
    const filename = req.query.filename?.toString();

    if (!filename) {
        return res.status(400).json({ message: "Unprocessable field" });
    }

    const filePath = join(STATIC_DIR_PATH, filename);

    if (!existsSync(filePath)) {
        return res.status(404).json({ message: "Not found" });
    }

    res.status(200).sendFile(filePath);
});