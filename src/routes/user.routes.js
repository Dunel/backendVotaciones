import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createUser,
  deleteUser,
  getCountUsers,
  getElectUsers,
  getUserId,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";

const router = Router();

router.get("/", authMiddleware([2]), getUsers);

router.get("/:id", authMiddleware([2]), getUserId);

router.post("/stats/count", authMiddleware([1, 2]), getCountUsers);

router.post("/getelect", authMiddleware([2]), getElectUsers);

router.post("/", authMiddleware([2]), createUser);

router.put("/", authMiddleware([2]), updateUser);

router.delete("/:id", authMiddleware([2]), deleteUser);

export default router;
