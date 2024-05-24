import { Router } from "express";
import { authService } from "../services/auth.service";

export const authRouter = Router();

authRouter.post('/signup', authService.signUp);
authRouter.post('/signin', authService.signIn);
authRouter.get('/me', authService.getMe);