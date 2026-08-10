import { Router } from "express";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createCategoryValidation, updateCategoryValidation, categoryIdValidation } from "./category.validation";

const router = Router();

router.get("/", getAllCategories);
router.get("/:id", validate(categoryIdValidation), getCategoryById);

router.post("/", auth(["ADMIN"]), validate(createCategoryValidation), createCategory);
router.put("/:id", auth(["ADMIN"]), validate(updateCategoryValidation), updateCategory);
router.delete("/:id", auth(["ADMIN"]), validate(categoryIdValidation), deleteCategory);

export const categoryRoutes = router;
