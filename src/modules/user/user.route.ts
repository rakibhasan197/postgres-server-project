import { Router } from "express";
import { getAllUsers, getUserById, updateUser, deleteUser } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { validate } from "../../middlewares/validate";
import { updateUserValidation, userIdValidation } from "./user.validation";

const router = Router();

router.get("/", auth(["ADMIN"]), getAllUsers);
router.get("/:id", auth(), validate(userIdValidation), getUserById);
router.put("/:id", auth(), validate(userIdValidation), validate(updateUserValidation), updateUser);
router.delete("/:id", auth(), validate(userIdValidation), deleteUser);

export const userRoutes = router;
