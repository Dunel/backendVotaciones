import { Router } from "express";
import { Login } from "../controllers/login.controller.js";

const router = Router();

router.post("/", Login);

export default router;
