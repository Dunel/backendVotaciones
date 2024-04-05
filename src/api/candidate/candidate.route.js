import { Router } from 'express';
import { prisma } from '../../db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = Router();

// Ruta para crear un candidato
router.post("/create", /*authMiddleware([2]),*/ async (req, res, next) => {
  try {
    const { name, party, image, electionId } = req.body;
    console.log(req.body);

    if (!name || !electionId) {
      return res.status(400).json({ error: "Se requieren el nombre del candidato y el ID de la elección" });
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        party,
        image,
        election: { connect: { id: parseInt(electionId) } }
      }
    });

    res.status(201).json(newCandidate);
  } catch (error) {
    next(error);
  }
});

// Ruta para obtener todos los candidatos
router.get("/", authMiddleware([2]), async (req, res, next) => {
  try {
    const candidates = await prisma.candidate.findMany();
    res.status(200).json(candidates);
  } catch (error) {
    next(error);
  }
});

// Ruta para actualizar un candidato
router.put("/:candidateId", authMiddleware([2]), async (req, res, next) => {
    try {
      const { candidateId } = req.params;
      const { name, party, image } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Se requiere el nombre del candidato para actualizar" });
      }
  
      // Verificar si el candidato existe y fue creado por el usuario autenticado
      const candidate = await prisma.candidate.findFirst({
        where: {
          id: parseInt(candidateId),
          createdBy: { id: req.user.id } // ID del usuario autenticado
        }
      });
  
      if (!candidate) {
        return res.status(404).json({ error: "El candidato no existe o no fue creado por el usuario autenticado" });
      }
  
      const updatedCandidate = await prisma.candidate.update({
        where: { id: parseInt(candidateId) },
        data: { name, party, image }
      });
  
      res.status(200).json(updatedCandidate);
    } catch (error) {
      next(error);
    }
  });
  
  // Ruta para eliminar un candidato
  router.delete("/:candidateId", authMiddleware([2]), async (req, res, next) => {
    try {
      const { candidateId } = req.params;
  
      // Verificar si el candidato existe y fue creado por el usuario autenticado
      const candidate = await prisma.candidate.findFirst({
        where: {
          id: parseInt(candidateId),
          createdBy: { id: req.user.id } // ID del usuario autenticado
        }
      });
  
      if (!candidate) {
        return res.status(404).json({ error: "El candidato no existe o no fue creado por el usuario autenticado" });
      }
  
      await prisma.candidate.delete({
        where: { id: parseInt(candidateId) }
      });
  
      res.status(200).json({ message: "El candidato ha sido eliminado correctamente" });
    } catch (error) {
      next(error);
    }
  });  

export default router;