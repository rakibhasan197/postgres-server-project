import { Router } from "express";
import { register, login, getMe } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { registerValidation, loginValidation } from "./auth.validation";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", validate(loginValidation), login);
router.get("/me", auth(), getMe);

export const authRoutes = router;
