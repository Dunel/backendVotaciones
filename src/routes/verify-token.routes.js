import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post("/", authMiddleware([1,2]), async (req, res, next) => {
    try {
        const { cedula, nombre, apellido } = req.user;

        res.status(200).json({ cedula, nombre, apellido });
    } catch (error) {
        next(error);
    }
});

router.post("/admin", authMiddleware([2]), async (req, res, next) => {
    try {
        const { cedula, nombre, apellido } = req.user;
        res.status(200).json({ cedula, nombre, apellido });
    } catch (error) {
      next(error);
    }
  });

  router.post("/check", authMiddleware([1,2]), async (req, res, next) => {
    try {
        res.status(200).json({ message: "ok" });
    } catch (error) {
        res.status(404).json({ message: "Not found" });
    }
  });

export default router;
