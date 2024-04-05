import { Router } from "express";
import { prisma } from "../../db.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

// Ruta para obtener todos los votos
router.get("/" /*, authMiddleware([2])*/, async (req, res, next) => {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        user: true,
        candidate: true,
      },
    });
    res.status(200).json(votes);
  } catch (error) {
    next(error);
  }
});

router.post("/create", authMiddleware([1, 2]), async (req, res, next) => {
  try {
    let { candidateId, electionId } = req.body;
    let userId = req.user.cedula;
    console.log(userId);

    if (!userId || !electionId) {
      return res.status(400).json({
        error:
          "Se requieren la eleccion.",
      });
    }

    const existingVote = await prisma.vote.findFirst({
      where: {
        userCedula: parseInt(userId),
        electionId: parseInt(electionId),
      },
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ error: "El usuario ya ha votado en esta elección" });
    }

    const newVote = await prisma.vote.create({
      data: {
        userCedula: parseInt(userId),
        candidateId: parseInt(candidateId),
        electionId: parseInt(electionId),
      },
    });

    res.status(200).json({ newVote, message: "voto aceptado" });
  } catch (error) {
    next(error);
  }
});

export default router;
