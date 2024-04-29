import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { prisma } from "../db.js";
import { userSchema } from "../validations/users.schema.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getUserId = async (req, res) => {
  try {
    let cedula = userSchema.shape.cedula.parse(req.params.id);

    const users = await prisma.user.findUnique({
      where: {
        cedula,
      },
      select: {
        fullname: true,
        cedula: true,
        nacionalidad: true,
        birthdate: true,
        estadoId: true,
        municipioId: true,
        parroquiaId: true,
        answer: true,
        question: true,
      },
    });

    if (!users) {
      return res.status(400).json({ message: "Usuario no encontrado." });
    }

    res.json(users);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const createUser = async (req, res) => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const {
      cedula,
      password,
      fullname,
      nacionalidad,
      birthdate,
      estadoId,
      municipioId,
      parroquiaId,
      question,
      answer,
    } = result.data;

    const address = await prisma.parroquia.findUnique({
      where: {
        id: parroquiaId,
        municipioId: municipioId,
        municipio: {
          estadoId: estadoId,
        },
      },
    });
    if (!address) {
      return res
        .status(400)
        .json({ error: "Error en la selección de residencia." });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        cedula,
      },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "La cédula se encuentra registrada." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        cedula,
        nacionalidad,
        birthdate,
        password: hashedPassword,
        estadoId,
        municipioId,
        parroquiaId,
        question,
        answer,
      },
    });

    if (!newUser) {
      return res.status(500).json({ message: "Internal error." });
    }

    return res.status(200).json({ message: "Usuario registrado." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const updateUser = async (req, res) => {
  try {
    //console.log(req.body);
    const result = userSchema.safeParse(req.body);
    const {
      cedula,
      password,
      fullname,
      nacionalidad,
      birthdate,
      estadoId,
      municipioId,
      parroquiaId,
      answer,
      question,
    } = result.data;
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        cedula,
      },
    });
    if (!existingUser) {
      return res.status(400).json({ error: "Cedula no encontrada." });
    }

    const address = await prisma.parroquia.findUnique({
      where: {
        id: parroquiaId,
        municipioId: municipioId,
        municipio: {
          estadoId: estadoId,
        },
      },
    });
    if (!address) {
      return res
        .status(400)
        .json({ error: "Error en la selección de residencia." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.update({
      where: {
        cedula,
      },
      data: {
        fullname,
        nacionalidad,
        password: hashedPassword,
        birthdate,
        estadoId,
        municipioId,
        parroquiaId,
        answer,
        question,
      },
    });

    res.status(200).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};
