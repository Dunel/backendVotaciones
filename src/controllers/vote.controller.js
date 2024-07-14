import { prisma } from "../db.js";
import { voteSchema } from "../validations/vote.schema.js";

export const getAllVotes = async (req, res) => {
  try {
    const result = voteSchema.shape.electionId.safeParse(req.params.id)
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }

    const votes = await prisma.vote.findMany({
      where:{
        electionId: result.data
      },
      select: {
        id: true,
        candidateId: true,
        electionId: true,
        createdAt: true,
      },
    });
    
    return res.status(200).json(votes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const createVote = async (req, res) => {
  try {
    const result = voteSchema.safeParse({
      ...req.body,
      userCedula: req.user.cedula,
    });
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const { candidateId, electionId, userCedula } = result.data;

    const existingElection = await prisma.election.findFirst({
      where: {
        id: electionId,
      },
    });
    if (!existingElection) {
      return res.status(400).json({ error: "La elección no existe." });
    }

    const existingCandidate = await prisma.candidate.findFirst({
      where: {
        id: candidateId,
      },
    });
    if (!existingCandidate) {
      return res.status(400).json({ error: "El candidato no existe." });
    }

    const existingVote = await prisma.userVote.findFirst({
      where: {
        userCedula,
        electionId,
      },
    });
    if (existingVote) {
      return res
        .status(400)
        .json({ error: "El usuario ya ha votado en esta elección" });
    }

    const newVote = await prisma.vote.create({
      data: {
        candidateId,
        electionId,
      },
    });
    const newVoter = await prisma.userVote.create({
      data: {
        userCedula,
        electionId
      },
    });

    return res.status(201).json({ newVote, message: "Voto enviado." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};
