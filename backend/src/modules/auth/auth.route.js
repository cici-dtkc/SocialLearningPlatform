import { Router } from "express";
import { login, logout, register } from "./auth.controller.js";
import { loginValidation, registerValidation } from "./auth.validation.js";

const router = Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);

export default router;