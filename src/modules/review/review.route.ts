import { Router } from "express";
import { createReview, getProductReviews, updateReview, deleteReview } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { createReviewValidation, updateReviewValidation, reviewIdValidation } from "./review.validation";

const router = Router();

router.get("/product/:productId", getProductReviews);

router.post("/", auth(), validate(createReviewValidation), createReview);
router.put("/:id", auth(), validate(updateReviewValidation), updateReview);
router.delete("/:id", auth(), validate(reviewIdValidation), deleteReview);

export const reviewRoutes = router;
