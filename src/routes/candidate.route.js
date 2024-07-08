import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCandidate,
  deleteCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
} from "../controllers/candidate.controller.js";

const router = Router();

router.post("/", authMiddleware([2]), createCandidate);

router.get("/", authMiddleware([2]), getAllCandidates);

router.put("/", authMiddleware([2]), updateCandidate);

router.delete("/:id", authMiddleware([2]), deleteCandidate);

router.get("/:id", authMiddleware([2]), getCandidate);

export default router;
