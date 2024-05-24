import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import sequelize from './db';
import session from 'express-session';
import { HOST, PORT, SESSION_SECRET, STATIC_DIR_PATH } from './config';
import './models/models';
import { authRouter } from './routers/auth';
import multer from 'multer';
import { storageConfig } from './upload';
import { authChecker } from './middlewares/auth-checker/auth-checker';
import { fileRouter } from './routers/file';
import { authorRouter } from './routers/author';
import { postRouter } from './routers/post';
import { categoryRouter } from './routers/category';
import { tagsRouter } from './routers/tag';
import { requestMiddleware } from './middlewares/request/request-middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(session({secret: SESSION_SECRET}));
app.use(multer({storage:storageConfig}).single("image"));
app.use(authChecker);
app.use(requestMiddleware);
app.use('/auth', authRouter);
app.use('/author', authorRouter);
app.use('/posts', postRouter);
app.use('/categories', categoryRouter);
app.use('/tags', tagsRouter);
app.use('/', fileRouter);

async function start() {
    try {
        if (!fs.existsSync(STATIC_DIR_PATH)) {
            fs.mkdirSync(STATIC_DIR_PATH);
        }

        await sequelize.authenticate();
        await sequelize.sync();

        app.listen(PORT, HOST, () => console.log(`Server has been started on port ${PORT}`))  
    } catch (error: any) {
        console.error('Occured error:', error.message);
    }
}

start();