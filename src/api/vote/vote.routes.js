import { Router } from 'express';
import { prisma } from '../../db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = Router();

// Ruta para obtener todos los votos
router.get("/", authMiddleware([2]), async (req, res, next) => {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        user: true,
        candidate: true
      }
    });
    res.status(200).json(votes);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
    try {
      const { userId, candidateId } = req.body;
  
      if (!userId || !candidateId) {
        return res.status(400).json({ error: "Se requieren el ID de usuario y el ID de candidato para crear un voto" });
      }
  
      // Verificar si el usuario ya ha votado en la misma elección
      const existingVote = await prisma.vote.findFirst({
        where: {
          userId: parseInt(userId),
          candidate: { electionId: candidateId }
        }
      });
  
      if (existingVote) {
        return res.status(400).json({ error: "El usuario ya ha votado en esta elección" });
      }
  
      const newVote = await prisma.vote.create({
        data: {
          userId: parseInt(userId),
          candidateId: parseInt(candidateId)
        }
      });
  
      res.status(201).json(newVote);
    } catch (error) {
      next(error);
    }
  });  

export default router;