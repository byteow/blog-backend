import { Router } from "express";
import { postService } from "../services/post.service";

export const postRouter = Router();

postRouter.post('/create', postService.createPost);
postRouter.post('/update', postService.updatePost);
postRouter.get('/', postService.getPost);
postRouter.get('/search', postService.getPosts);
postRouter.delete('/', postService.deletePost);