import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db.js";

const router = Router();

router.post("/", async (req, res, next) => {
  const { cedula, password } = req.body;
  console.log(req.body);

  try {
    if (!cedula) {
      return res.status(400).json({ error: "Se requiere el campo cedula" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { cedula: cedula },
    });

    if (!existingUser) {
      return res.status(401).json({ error: "Cédula o contraseña incorrecta" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Cédula o contraseña incorrecta" });
    }

    const { role } = existingUser;

    const token = jwt.sign(
      {
        nombre: existingUser.nombre,
        apellido: existingUser.apellido,
        cedula: existingUser.cedula,
        role: role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
