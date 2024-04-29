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
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const { title, description, startDate, endDate, active } = result.data;

    const newElection = await prisma.election.create({
      data: {
        title,
        description,
        startDate,
        endDate,
        active
      },
    });

    res.status(201).json(newElection);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const updateElection = async (req, res, next) => {
  try {
    const result = fullSchema.safeParse(req.body);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const { id, title, description, startDate, endDate, active } = result.data;
    const updateElection = await prisma.election.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        startDate,
        endDate,
        active,
      },
    });

    return res.status(200).json(updateElection);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getAllElections = async (req, res) => {
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
  }