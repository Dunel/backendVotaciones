import { Router } from 'express';
import authMiddleware from '../../middleware/authMiddleware.js';

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

export default router;
