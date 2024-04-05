import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../db.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { cedula, password, nacionalidad } = req.body;
    console.log(req.body);

    if (!cedula || !password || !nacionalidad) {
      return res.status(400).json({ message: "Se requiere el campo cedula" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        cedula: parseInt(cedula),
        nacionalidad,
      },
    });

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Cédula o contraseña incorrecta" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Cédula o contraseña incorrecta" });
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

    res.json({
      token,
      cedula,
      nombre: existingUser.nombre,
      apellido: existingUser.apellido,
      role: role,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error en el servicio." });
  }
});

export default router;
