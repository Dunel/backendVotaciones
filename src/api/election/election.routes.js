import { Router } from "express";
import { prisma } from "../../db.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = Router();

// Función para validar si una fecha es válida
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

router.post("/create", authMiddleware([2]), async (req, res, next) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    // Validar que se proporcionen todos los campos necesarios
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Se requieren todos los campos" });
    }

    // Validar las fechas proporcionadas
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res
        .status(400)
        .json({ error: "Las fechas proporcionadas son inválidas" });
    }

    const newElection = await prisma.election.create({
      data: {
        title,
        description,
        startDate,
        endDate,
      },
    });

    res.status(201).json(newElection);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    next(error);
  }
});

router.put("/:electionId", authMiddleware([2]), async (req, res, next) => {
  try {
    const { electionId } = req.params;
    const { title, description, startDate, endDate } = req.body;

    // Validar que se proporcionen todos los campos necesarios
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ error: "Se requieren todos los campos" });
    }

    // Validar las fechas proporcionadas
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res
        .status(400)
        .json({ error: "Las fechas proporcionadas son inválidas" });
    }

    // Resto del código para actualizar la elección...
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    next(error);
  }
});

// Ruta para obtener todas las elecciones
router.get("/", authMiddleware([1, 2]), async (req, res, next) => {
  try {
    // Obtener todas las elecciones de la base de datos
    const elections = await prisma.election.findMany({
      include: {
        candidates: true,
      },
    });

    // Enviar la respuesta con todas las elecciones
    res.status(200).json(elections);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el proceso
    next(error);
  }
});

export default router;
