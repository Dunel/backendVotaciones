import bcrypt from 'bcrypt';
import { Router } from 'express';
import { prisma } from '../../db.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = Router();

router.get("/", authMiddleware([2]), async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.post("/create", async (req, res, next) => {
    let { nombre, apellido, cedula, password, nacionalidad } = req.body;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*./=\\])[A-Za-z\d@#$%&*./=\\]{8,}$/;
  const nameRegex = /^[A-Za-z\s]+$/;
  const cedulaRegex = /^\d+$/;
  const nacionalidadRegex = /^[VE]$/;

  if (!nombre || !apellido || !cedula || !password || !nacionalidad) {
    return res.status(400).json({ error: "Faltan campos requeridos en la solicitud" });
  }

  if(!nombre.trim() || !apellido.trim()){
    return res.status(400).json({ error: "Faltan campos requeridos en la solicitud" });
  }

  if (!nameRegex.test(nombre)) {
    return res.status(400).json({ error: "El nombre no es válido" });
  }

  if (!nameRegex.test(apellido)) {
    return res.status(400).json({ error: "El apellido no es válido" });
  }

  if (!cedulaRegex.test(cedula)) {
    return res.status(400).json({ error: "La cédula debe contener solo números" });
  }

  if (!nacionalidadRegex.test(nacionalidad)) {
    return res.status(400).json({ error: "La nacionalidad no es válida" });
  }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "La contraseña no cumple con los requisitos" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { cedula },
    });

    if (existingUser) {
      return res.status(400).json({ error: "La cédula ya está registrada" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nombre,
        apellido,
        cedula,
        nacionalidad,
        password: hashedPassword,
      },
    });

    res.json(newUser);
  } catch (error) {
    next(error);
  }
});

export default router;
