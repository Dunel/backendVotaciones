import { z } from "zod";

const questionRegex = /^[a-zA-Z\s]+$/;

export const dateSchema = z.object({
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
});

export const loginSchema = dateSchema.extend({
  password: z
    .string({ required_error: "La contraseña es requerida." })
    .min(8, { message: "La contraseña debe tener minimo 8 caracteres." }),
})


export const securitySchema = z.object({
  question: z.enum(["question1", "question2", "question3"], {
    errorMap: (issue, ctx) => {
      return { message: "Por favor, seleccione una pregunta valida." };
    },
  }),
  answer: z
    .string({ required_error: "Se requiere la respuesta de la pregunta de seguridad." })
    .min(3)
    .max(50)
    .regex(questionRegex)
    .transform((val, ctx) => {
      const answer = val.toLowerCase();
      return answer;
    }),
});

export const recoverySchema = securitySchema.merge(dateSchema)