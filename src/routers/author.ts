import { Router } from "express";
import { authorService } from "../services/author.service";

export const authorRouter = Router();

authorRouter.post('/update', authorService.updateAuthor);
authorRouter.delete('/delete', authorService.deleteAuthor);
authorRouter.get('/', authorService.getAuthor);