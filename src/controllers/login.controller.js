import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, recoverySchema } from "../validations/login.schema.js";
import { prisma } from "../db.js";
import { ZodError } from "zod";

export const Login = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => [err.message]));
    }

    const { cedula, password, nacionalidad } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: {
        cedula,
        nacionalidad,
      },
    });

    if (!existingUser) {
      return res.status(401).json(["Cédula o contraseña incorrecta."]);
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json(["Cédula o contraseña incorrecta."]);
    }

    const token = jwt.sign(
      {
        fullname: existingUser.fullname,
        cedula: existingUser.cedula,
        role: existingUser.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      token,
      cedula: existingUser.cedula,
      fullname: existingUser.fullname,
      role: existingUser.role,
      timeExpires: existingUser.passwordUpdated,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json(["Error en el servicio."]);
  }
};

export const recoveryLogin = async (req, res) => {
  try {
    const result = recoverySchema.safeParse(req.body);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => [err.message]));
    }
    const { cedula, nacionalidad, question, answer } = result.data;

    const userFound = await prisma.user.findFirst({
      where: {
        cedula,
        nacionalidad,
        question,
        answer,
      },
    });
    if (!userFound) {
      return res.status(401).json(["El usuario no existe."]);
    }

    const token = jwt.sign(
      {
        cedula: userFound.cedula,
        role: 0,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30min" }
    );

    const userUpdate = await prisma.user.update({
      where: {
        cedula,
      },
      data: {
        tokenRecovery: token,
      },
    });

    return res.status(200).json(token);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json(["Error en el servicio."]);
  }
};

export const recoveryPassword = async (req, res) => {
  try {
    const {cedula} = req.user;
    const result = loginSchema.shape.password.safeParse(req.body.password);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => [err.message]));
    }
    const hashedPassword = await bcrypt.hash(result.data, 10);

    const userFound = await prisma.user.findFirst({
      where:{
        cedula,
        tokenRecovery: req.token
      }
    })
    if (!userFound) {
      return res.status(401).json("El token no existe.");
    }
    const passwordUpdated = new Date()
    const updatedPassword = await prisma.user.update({
      where: {
        cedula,
        tokenRecovery: req.token,
      },
      data: {
        password: hashedPassword,
        tokenRecovery: "",
        passwordUpdated
      },
    });

    return res.status(200).json("Recuperación Completada.");
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(error)
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json(["Error en el servicio."]);
  }
};
