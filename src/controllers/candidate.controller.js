import { prisma } from "../db.js";
import {
  candidateSchema,
  fullCandidateSchema,
} from "../validations/candidate.schema.js";
import { ZodError } from "zod";

export const createCandidate = async (req, res) => {
  try {
    const result = candidateSchema.safeParse(req.body);
    //console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const { name, image, electionId } = result.data;

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        image,
        electionId,
      },
    });

    const countsCandidate = await prisma.candidate.count({
      where: {
        electionId: electionId,
      },
    });
    if (countsCandidate == 2) {
      const electionActive = await prisma.election.update({
        where: {
          id: electionId,
        },
        data: {
          active: "active",
        },
      });
    }

    return res.status(201).json(newCandidate);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        election: true,
      },
    });
    return res.status(200).json(candidates);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const result = fullCandidateSchema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const { name, image, id, electionId } = result.data;

    const candidate = await prisma.candidate.findFirst({
      where: {
        id,
      },
    });
    if (!candidate) {
      return res.status(404).json({
        message: "El candidato no existe.",
      });
    }

    const election = await prisma.election.findFirst({
      where: {
        id: electionId,
      },
    });
    if (!election) {
      return res.status(404).json({
        message: "La elección no existe.",
      });
    }

    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        name,
        image,
        electionId,
      },
    });

    return res.status(200).json(updatedCandidate);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const result = fullCandidateSchema.shape.id.safeParse(req.params.id);
    //console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const id = result.data;

    const candidate = await prisma.candidate.findFirst({
      where: {
        id,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        error: "El candidato no existe.",
      });
    }

    await prisma.candidate.delete({
      where: { id },
    });

    const countsCandidate = await prisma.candidate.count({
      where: {
        electionId: candidate.electionId,
      },
    });
    if (countsCandidate == 1) {
      const electionActive = await prisma.election.update({
        where: {
          id: candidate.electionId,
        },
        data: {
          active: "inactive",
        },
      });
    }

    return res
      .status(200)
      .json({ message: "La opción ha sido eliminado correctamente." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const result = fullCandidateSchema.shape.id.safeParse(req.params.id);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const id = result.data;

    const candidate = await prisma.candidate.findFirst({
      where: {
        id,
      },
    });

    if (!candidate) {
      return res.status(404).json({
        error: "El candidato no existe.",
      });
    }

    return res.status(200).json(candidate);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};
