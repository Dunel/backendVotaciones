import { z } from "zod";

export const voteSchema = z.object({
  userCedula: z.number().min(1).max(99999999),
  candidateId: z
    .number()
    .min(0)
    .max(99999999)
    .transform((val, ctx) => {
      if (val == 0) {
        return;
      }
      return val;
    }),
  electionId: z
    .number()
    .min(1)
    .max(99999999)
    .or(
      z
        .string()
        .max(11)
        .min(1)
        .transform((val, ctx) => {
          const parsed = parseInt(val);
          if (isNaN(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Solo se permiten números en el campo elección.",
            });
            return z.NEVER;
          }
          return parsed;
        })
    ),
});

export const voteFullSchema = voteSchema.extend({
  userCedula: z.number().min(1).max(99999999),
});
