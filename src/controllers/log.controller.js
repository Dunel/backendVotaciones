import { prisma } from "../db.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await prisma.log.findMany({
      orderBy:{
        id: 'desc'
      },
      include:{
        user: {
          select:{
            fullname: true,
            id: true,
          },
        }
      }
    });
    return res.status(200).json(logs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal error." });
  }
};
