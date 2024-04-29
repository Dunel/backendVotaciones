import { prisma } from "../db.js";
import { ZodError } from "zod";
import { venezuelaSchema } from "../validations/venezuela.schema.js";

export const getEstado = async (req, res) => {
  try {
    const result = venezuelaSchema.shape.idEstado.safeParse(req.params.id);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const id = result.data;

    const estado = await prisma.estado.findFirst({
      where: {
        id,
      },
    });

    return res.json(estado);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getAllEstados = async (req, res) => {
  try {
    const estados = await prisma.estado.findMany();

    return res.json(estados);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getMunicipios = async (req, res) => {
  try {
    const result = venezuelaSchema.shape.idEstado.safeParse(
      req.params.idEstado
    );
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const id = result.data;

    const municipios = await prisma.municipio.findMany({
      where: {
        estadoId: id,
      },
    });

    return res.json(municipios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

export const getParroquias = async (req, res) => {
  try {
    const result = venezuelaSchema.shape.idMunicipio.safeParse(
      req.params.idMunicipio
    );
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const idMunicipio = result.data;

    const parroquias = await prisma.parroquia.findMany({
      where: {
        municipioId: idMunicipio,
      },
    });

    return res.json(parroquias);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};

/*export const getParroquia = async (req, res) => {
  try {
    const result = venezuelaSchema.safeParse(req.params);
    console.log(result);
    if (!result.success) {
      return res
        .status(400)
        .json(result.error.issues.map((err) => err.message));
    }
    const { idMunicipio, idEstado } = result.data;
    const idParroquia = parseInt(req.params.idParroquia);

    const parroquias = await prisma.parroquia.findUnique({
      where: {
        id: idParroquia,
        municipioId: idMunicipio,
        municipio: {
          estadoId: idEstado,
        },
      },
    });

    if (!parroquias) {
      return res.status(404).json({ message: "errol" });
    }
    //console.log(parroquias);
    return res.json(parroquias);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json(error.issues.map((err) => err.message));
    }
    console.error(error);
    return res.status(500).json({ message: "Internal error." });
  }
};*/
