import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createElection,
  deleteElection,
  getAllAdminElections,
  getAllElections,
  getElection,
  getElectionAdminResult,
  getElectionResult,
  getHomeAdminElections,
  updateElection,
} from "../controllers/election.controller.js";

const router = Router();

router.post("/", authMiddleware([2]), createElection);

router.put("/", authMiddleware([2]), updateElection);

router.get("/", authMiddleware([1, 2]), getAllElections);

router.get("/admin", authMiddleware([2]), getAllAdminElections);

router.get("/homeadmin", authMiddleware([2]), getHomeAdminElections);

router.get("/:electionId", authMiddleware([1, 2]), getElection);

router.get("/result/:electionId", authMiddleware([1, 2]), getElectionResult);

router.get("/results/:electionId", authMiddleware([2]), getElectionAdminResult);

router.delete("/:electionId", authMiddleware([2]), deleteElection);

export default router;
