import { Router } from "express";
import { Login, recoveryLogin, recoveryPassword } from "../controllers/login.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", Login);

router.post("/recovery", recoveryLogin)

router.put("/recovery/password", authMiddleware([0]), recoveryPassword)

export default router;
