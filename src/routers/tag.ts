import { Router } from "express";
import { tagService } from "../services/tag.service";

export const tagsRouter = Router();

tagsRouter.post('/create', tagService.createTag);
tagsRouter.post('/update', tagService.updateTag);
tagsRouter.delete('/', tagService.deleteTag);
tagsRouter.get('/', tagService.getTag);
tagsRouter.get('/search', tagService.getTags);