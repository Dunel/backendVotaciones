import { z } from "zod";

export const candidateSchema = z.object({
  name: z
    .string({ required_error: "El nombre del candidato es requerido." })
    .min(3, { message: "El nombre debe tener minimo 3 caracteres." })
    .max(50, { message: "El nombre debe tener maximo 50 caracteres." }),
  party: z
    .string()
    .min(3, { message: "El partido debe tener minimo 3 caracteres." })
    .max(50, { message: "El partido debe tener maximo 50 caracteres." })
    .optional(),
  partyImage: z
    .string()
    .url({ message: "URL no valida." })
    .min(10)
    .max(150)
    .optional(),
  image: z
    .string()
    .url({ message: "URL no valida." })
    .min(10)
    .max(150)
    .optional(),
  electionId: z.number({
    required_error: "La eleccion es requerida para el registro del candidato.",
  }).min(1).max(99999999),
});

export const fullCandidateSchema = candidateSchema.extend({
  id: z
    .number({ required_error: "Se requiere el Candidato." })
    .min(1)
    .max(99999999)
    .or(z.string()
        .min(1)
        .max(11)
        .transform((val, ctx) => {
          const parsed = parseInt(val);
          if (isNaN(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Solo se permiten números en el campo.",
            });
            return z.NEVER;
          }
          return parsed;
        })
    ),
});
