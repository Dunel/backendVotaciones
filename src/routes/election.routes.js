import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createElection, getAllElections, getElection, updateElection } from "../controllers/election.controller.js";

const router = Router();

router.post("/", authMiddleware([2]), createElection);

router.put("/", authMiddleware([2]), updateElection);

router.get("/", /*authMiddleware([1, 2]),*/ getAllElections);

router.get("/:electionId", authMiddleware([1, 2]), getElection);

export default router;
