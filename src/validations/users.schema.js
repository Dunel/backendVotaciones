import { z } from "zod";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%&*./=\\])[A-Za-z\d@#$%&*./=\\]+$/;

const questionRegex = /^[a-zA-Z\s]+$/;

export const userSchema = z.object({
  /*id: z.number().optional(),*/
  /*role: z.number(),*/
  nacionalidad: z.enum(["V", "E"], {
    errorMap: (issue, ctx) => {
      return { message: "Por favor, seleccione una nacionalidad valida." };
    },
  }),
  cedula: z
    .string({ required_error: "La cedula es requerida." })
    .max(18, { message: "La cedula debe tener maximo 18 caracteres." })
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
    }),
  password: z
    .string({ required_error: "La contraseña es requerida." })
    .min(8, { message: "La contraseña debe tener minimo 8 caracteres." })
    .max(26, { message: "La contraseña debe tener maximo 26 caracteres." })
    .regex(passwordRegex, {
      message:
        "La contraseña debe contener al menos una letra mayúscula, un dígito y uno de los siguientes caracteres especiales: @, #, $, %, &, *, ., /, =,.",
    }),
  fullname: z
    .string({ required_error: "El nombre completo es requerido." })
    .min(5, { message: "El nombre debe tener minimo 5 caracteres." })
    .max(50, { message: "El nombre debe tener maximo 50 caracteres." }),
  birthdate: z
    .string({
      errorMap: (issue, ctx) => {
        return { message: "Por favor, seleccione una fecha valida." };
      },
    })
    .datetime({ offset: true }),
  estadoId: z
    .number({ required_error: "Se requiere el estado." })
    .min(1)
    .max(24),
  municipioId: z
    .number({ required_error: "Se requiere el municipio." })
    .min(1)
    .max(462),
  parroquiaId: z
    .number({ required_error: "Se requiere la parroquia." })
    .min(1)
    .max(1138),
  question: z.enum(["question1", "question2", "question3"], {
    errorMap: (issue, ctx) => {
      return { message: "Por favor, seleccione una pregunta valida." };
    },
  }),
  answer: z
    .string({ required_error: "Se requiere la respuesta a la pregunta." })
    .min(3)
    .max(50)
    .regex(questionRegex)
    .transform((val, ctx) => {
      const answer = val.toLowerCase();
      return answer;
    }),
});
