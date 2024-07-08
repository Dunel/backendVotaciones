import { prisma } from "../db.js";
import {
  electionSchema,
  elecIdSchema,
  fullSchema,
} from "../validations/election.schema.js";
import { ZodError } from "zod";

export const createElection = async (req, res) => {
  try {
    const result = electionSchema.safeParse(req.body);
    //console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const {
      title,
      description,
      startDate,
      endDate,
      type,
      typeId,
      roleElection,
    } = result.data;

    const newElection = await prisma.election.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        type,
        typeId,
        roleElection,
      },
    });

    const log = await prisma.log.create({
      data: {
        message: `ELECCIÓN ${title} REGISTRADA`,
        userId: req.user.cedula,
      },
    });
    console.log(log);

    return res.status(201).json(newElection);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const updateElection = async (req, res) => {
  try {
    const result = fullSchema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const {
      id,
      title,
      description,
      startDate,
      endDate,
      type,
      typeId,
      roleElection,
    } = result.data;
    const updateElection = await prisma.election.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        startDate,
        endDate,
        type,
        typeId,
        roleElection,
      },
    });

    const log = await prisma.log.create({
      data: {
        message: `ELECCIÓN ID:#${id} ${title} MODIFICADA`,
        userId: req.user.cedula,
      },
    });
    console.log(log);

    return res.status(200).json(updateElection);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getAllAdminElections = async (req, res) => {
  try {
    const elections = await prisma.election.findMany({
      include: {
        votes: {
          select: {
            userCedula: true,
          },
        },
      },
    });

    return res.status(200).json(elections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getHomeAdminElections = async (req, res) => {
  try {
    const electionDate = new Date();
    electionDate.setHours(electionDate.getHours() - 24 * 7);
    console.log(electionDate);

    const elections = await prisma.election.findMany({
      where: {
        endDate: {
          gte: electionDate,
        },
        active: "active"
      },
      include: {
        votes: {
          select: {
            userCedula: true,
          },
        },
      },
    });

    return res.status(200).json(elections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

const dateValidator = (birthdate) => {
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 18);

  const selectedDate = new Date(birthdate);

  return selectedDate > minDate;
};

export const getAllElections = async (req, res) => {
  try {
    const cedula = parseInt(req.user.cedula);
    const userFound = await prisma.user.findUnique({
      where: {
        cedula,
      },
      select: {
        birthdate: true,
        estadoId: true,
        municipioId: true,
        parroquiaId: true,
      },
    });

    if (!userFound) {
      return res.status(404).json("User not found");
    }

    let rolesElection = ["especial"];
    if (!dateValidator(userFound.birthdate)) {
      rolesElection.push("normal");
    }

    const electionDate = new Date();
    electionDate.setHours(electionDate.getHours() - 24 * 7);
    console.log(electionDate);

    const elections = await prisma.election.findMany({
      where: {
        endDate: {
          gte: electionDate,
        },
        OR: [
          {
            type: "pais",
            typeId: 0,
          },
          {
            type: "estado",
            typeId: userFound.estadoId,
          },
          {
            type: "municipio",
            typeId: userFound.municipioId,
          },
          {
            type: "parroquia",
            typeId: userFound.parroquiaId,
          },
        ],
        roleElection: {
          in: rolesElection,
        },
      },
      include: {
        votes: {
          select: {
            userCedula: true,
          },
        },
      },
    });

    return res.status(200).json(elections);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getElection = async (req, res) => {
  try {
    const result = elecIdSchema.shape.id.safeParse(req.params.electionId);

    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const elections = await prisma.election.findUnique({
      where: { id: result.data },
      include: {
        candidates: true,
      },
    });

    return res.status(200).json(elections);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const result = elecIdSchema.shape.id.safeParse(req.params.electionId);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const elections = await prisma.election.deleteMany({
      where: { id: result.data },
    });

    if (elections.count < 1) {
      return res.status(404).json("Elección no encontrada.");
    }

    const log = await prisma.log.create({
      data: {
        message: `ELECCIÓN ID:#${result.data} ELIMINADA`,
        userId: req.user.cedula,
      },
    });
    console.log(log);

    return res.status(200).json("Elección eliminada.");
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getElectionResult = async (req, res) => {
  try {
    const result = elecIdSchema.shape.id.safeParse(req.params.electionId);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const elections = await prisma.election.findUnique({
      where: {
        id: result.data,
        endDate: {
          lt: new Date(),
        },
      },
      include: {
        candidates: {
          include: {
            _count: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    return res.status(200).json(elections);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getElectionAdminResult = async (req, res) => {
  try {
    const result = elecIdSchema.shape.id.safeParse(req.params.electionId);

    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const elections = await prisma.election.findUnique({
      where: {
        id: result.data,
      },
      include: {
        candidates: {
          include: {
            _count: true,
          },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    const log = await prisma.log.create({
      data: {
        message: `ELECCIÓN ID:#${result.data} ${elections.title} ESCRUTADA`,
        userId: req.user.cedula,
      },
    });
    console.log(log);

    return res.status(200).json(elections);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};
