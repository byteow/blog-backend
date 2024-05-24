import multer from "multer";
import { STATIC_DIR_PATH } from "./config";

export const storageConfig = multer.diskStorage({
    destination: (_, file, cb) =>{
        cb(null,  STATIC_DIR_PATH);
    },
    filename: (_, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});