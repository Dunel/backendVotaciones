import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { prisma } from "../db.js";
import { userSchema } from "../validations/users.schema.js";
import { electionSchema } from "../validations/election.schema.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getCountUsers = async (req, res) => {
  try {
    const typeId = electionSchema.shape.typeId.parse(req.body.typeId);
    const type = electionSchema.shape.type.parse(req.body.type);
    const roleElection = electionSchema.shape.roleElection.parse(
      req.body.roleElection
    );

    let countQuery = {};

    if (type === "pais") {
      // No se aplican filtros para el país
    } else if (type === "estado") {
      countQuery.estadoId = typeId;
    } else if (type === "municipio") {
      countQuery.municipioId = typeId;
    } else if (type === "parroquia") {
      countQuery.parroquiaId = typeId;
    }

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    if (roleElection == "normal") {
      countQuery.birthdate = { lte: minDate };
    }

    const usersCount = await prisma.user.count({
      where: countQuery,
    });

    return res.status(200).json(usersCount);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error("Error al contar usuarios:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
};

export const getElectUsers = async (req, res) => {
  try {
    const typeId = electionSchema.shape.typeId.parse(req.body.typeId);
    const type = electionSchema.shape.type.parse(req.body.type);
    const roleElection = electionSchema.shape.roleElection.parse(
      req.body.roleElection
    );

    let countQuery = {};

    if (type === "pais") {
    } else if (type === "estado") {
      countQuery.estadoId = typeId;
    } else if (type === "municipio") {
      countQuery.municipioId = typeId;
    } else if (type === "parroquia") {
      countQuery.parroquiaId = typeId;
    }

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    if (roleElection == "normal") {
      countQuery.birthdate = { lte: minDate };
    }

    const usersCount = await prisma.user.findMany({
      where: countQuery,
      select: {
        cedula: true,
        fullname: true,
      },
    });

    return res.status(200).json(usersCount);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error("Error al contar usuarios:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
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
      console.log(result.error.issues.map((err) => err.message));
      return res
        .status(403)
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
        .status(402)
        .json({ error: "Error en la selección de residencia." });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        cedula,
      },
    });
    if (existingUser) {
      return res
        .status(401)
        .json({ error: "La cédula se encuentra registrada." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //const birthdate2 = moment.tz(birthdate, "America/Caracas");
    //console.log(birthdate2)
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

    const log = await prisma.log.create({
      data: {
        message: `VOTANTE ${nacionalidad}-${cedula} REGISTRADO`,
        userId: req.user.cedula,
      },
    });

    console.log(log);

    if (!newUser) {
      return res.status(500).json({ message: "Internal error." });
    }

    return res.status(200).json({ message: "Usuario registrado." });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(error);
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
      answer,
      question,
    } = result.data;
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

    //const birthdate2 = moment.tz(birthdate, "America/Caracas").format();
    //console.log(moment.tz("1993-11-18", "America/Caracas").format())
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

    const log = await prisma.log.create({
      data: {
        message: `VOTANTE ${nacionalidad}-${cedula} MODIFICADO`,
        userId: req.user.cedula,
      },
    });
    console.log(log);

    return res.status(200).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    let cedula = userSchema.shape.cedula.parse(req.params.id);

    const users = await prisma.user.delete({
      where: {
        cedula,
      },
    });

    if (!users) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const log = await prisma.log.create({
      data: {
        message: `VOTANTE ${users.nacionalidad}-${users.cedula} ELIMINADO`,
        userId: req.user.cedula,
      },
    });
    console.log(log);

    return res
      .status(200)
      .json({ message: "Usuario Eliminado correctamente." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};
