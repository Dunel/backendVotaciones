import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getLogs } from "../controllers/log.controller.js";

const router = Router();

router.get("/", authMiddleware([2]), getLogs)

export default router;
