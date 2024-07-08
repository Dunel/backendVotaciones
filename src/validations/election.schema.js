import { z } from "zod";

export const electionSchema = z.object({
  title: z
    .string({ required_error: "Título requerido." })
    .min(5, { message: "El título debe tener minimo 5 caracteres." })
    .max(50, { message: "El título debe tener maximo 50 caracteres." }),
  description: z
    .string()
    .max(50, { message: "La descripcion debe tener maximo 50 caracteres." })
    .optional(),
  startDate: z
    .string({
      errorMap: (issue, ctx) => {
        return { message: "Por favor, seleccione una fecha valida." };
      },
    })
    .datetime({ offset: true }),
  endDate: z
    .string({
      errorMap: (issue, ctx) => {
        return { message: "Por favor, seleccione una fecha valida." };
      },
    })
    .datetime({ offset: true }),
  active: z.enum(["active", "inactive"], {
    errorMap: (issue, ctx) => {
      return { message: "Por favor, seleccione una activación valida." };
    },
  }).optional(),
  type: z.enum(["pais", "estado", "municipio", "parroquia"], {
    errorMap: (issue, ctx) => {
      return { message: "Por favor, seleccione un lugar valido." };
    },
  }),
  typeId: z
    .number({
      required_error: "Se requiere el id de la residencia.",
      invalid_type_error: "Solo se permiten números en el campo.",
    })
    .min(0)
    .max(1500),
    roleElection : z.enum(["normal", "especial"], {
      errorMap: (issue, ctx) => {
        return { message: "Por favor, seleccione un tipo de elección valido." };
      },
    })
});

export const elecIdSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(10)
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
    .or(z.number().min(1).max(99999999)),
});

export const fullSchema = electionSchema.merge(elecIdSchema);
