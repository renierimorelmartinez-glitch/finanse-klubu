import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().uuid(),
  grossAmount: z.number().positive("Kwota musi być większa od 0"),
  vatRate: z.number().refine((v) => [0, 8, 23].includes(v), "Stawka VAT: 0, 8 lub 23"),
  occurredAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format daty: YYYY-MM-DD"),
  note: z.string().optional(),
});

export const recurringRuleSchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  categoryId: z.string().uuid(),
  grossAmount: z.number().positive("Kwota musi być większa od 0"),
  vatRate: z.number().refine((v) => [0, 8, 23].includes(v), "Stawka VAT: 0, 8 lub 23"),
  dayOfMonth: z.number().int().min(1).max(31),
  isActive: z.boolean(),
  startMonth: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  endMonth: z.string().regex(/^\d{4}-\d{2}$/).nullable().optional(),
});

export const monthParamsSchema = z.object({
  zusAmount: z.number().min(0),
  pitAmount: z.number().min(0),
  vatAdjustmentAmount: z.number(),
});
