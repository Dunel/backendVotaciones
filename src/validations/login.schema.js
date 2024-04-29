import { z } from "zod";

export const loginSchema = z.object({
  nacionalidad: z.enum(["V", "E"], {
    errorMap: (issue, ctx) => {
      return { message: "Por favor, seleccione una nacionalidad valida." };
    },
  }),
  cedula: z
    .number({ required_error: "La cedula es requerida." })
    .min(1, { message: "La cedula debe tener maximo 11 caracteres." })
    .max(99999999999, { message: "La cedula debe tener maximo 11 caracteres." }).or(
    z.string({ required_error: "La cedula es requerida." })
    .max(11, { message: "La cedula debe tener maximo 11 caracteres." })
    .min(1, { message: "La cedula debe tener maximo 11 caracteres." })
    .transform((val, ctx) => {
      const parsed = parseInt(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Solo se permiten números en el campo cedula.",
        });
        return z.NEVER;
      }
      return parsed;
    })
    ),
  password: z
    .string({ required_error: "La contraseña es requerida." })
    .min(8, { message: "La contraseña debe tener minimo 8 caracteres." }),
});
