import { Router } from "express";
import { categoryService } from "../services/category.service";

export const categoryRouter = Router();

categoryRouter.post('/create', categoryService.createCategory);
categoryRouter.post('/update', categoryService.updateCategory);
categoryRouter.delete('/', categoryService.deleteCategory);
categoryRouter.get('/', categoryService.getCategory);
categoryRouter.get('/search', categoryService.getCategories);