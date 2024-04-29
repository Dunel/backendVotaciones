import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createVote, getAllVotes } from "../controllers/vote.controller.js";

const router = Router();

router.get("/:id", authMiddleware([2]), getAllVotes);

router.post("/", authMiddleware([1, 2]), createVote);

export default router;
