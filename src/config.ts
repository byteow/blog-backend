import path from "path";

export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_USER = process.env.DB_USER;
export const DB_PORT = parseInt(process.env.DB_PORT || '5432');
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const HOST = process.env.HOST || 'localhost';
export const PORT = parseInt(process.env.PORT || '5000');
export const SESSION_SECRET = process.env.SESSION_SECRET || 'secret';
export const PRODUCTION = parseInt(process.env.PRODUCTION || '0');

export const STATIC_DIR_PATH = path.join(path.resolve(), 'static');