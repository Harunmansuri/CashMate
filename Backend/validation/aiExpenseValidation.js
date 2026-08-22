// Backend/validation/aiExpenseValidation.js
// Nothing coming back from Gemini is trusted until it passes this schema.
import { z } from "zod";
import { ALLOWED_CATEGORIES } from "../services/geminiService.js";

export const aiExpenseInputSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1, "Please describe a transaction.")
        .max(300, "That message is a bit long — try describing just one transaction."),
});

// Matches the raw JSON shape Gemini returns (amount still a string here —
// see geminiService.js for why) and coerces/validates it into real types.
export const aiExpenseResultSchema = z.object({
    type: z.enum(["income", "expense"], {
        errorMap: () => ({ message: "AI could not determine income vs expense." }),
    }),
    amount: z
        .string()
        .transform((val) => (val === "null" || val.trim() === "" ? null : Number(val)))
        .refine((val) => val === null || (Number.isFinite(val) && val > 0), {
            message: "Amount must be a positive number.",
        }),
    category: z.enum(ALLOWED_CATEGORIES, {
        errorMap: () => ({ message: "AI returned an unrecognized category." }),
    }),
    merchant: z.string().optional().default(""),
    date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "AI returned an invalid date.")
        .refine((val) => !Number.isNaN(new Date(val).getTime()), "AI returned an invalid date."),
    description: z.string().min(1).max(200),
});
