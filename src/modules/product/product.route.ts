import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "./product.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createProductValidation, updateProductValidation, productIdValidation } from "./product.validation";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", validate(productIdValidation), getProductById);

router.post("/", auth(), validate(createProductValidation), createProduct);
router.put("/:id", auth(), validate(updateProductValidation), updateProduct);
router.delete("/:id", auth(), validate(productIdValidation), deleteProduct);

export const productRoutes = router;
