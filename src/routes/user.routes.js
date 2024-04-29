import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createUser, getUserId, getUsers, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", authMiddleware([2]), getUsers);

router.get("/:id", authMiddleware([2]), getUserId);

router.post("/", authMiddleware([2]), createUser);

router.put("/", authMiddleware([2]), updateUser);

export default router;
