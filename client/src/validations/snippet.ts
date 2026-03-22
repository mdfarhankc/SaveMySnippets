import { z } from "zod"


export const createEditSnippetSchema = z.object({
    title: z
        .string({ error: "Title is required!" })
        .trim()
        .min(5, "Title should be at least 5 characters.")
        .max(30, "Title must contain at most 30 characters."),
    description: z
        .string()
        .trim()
        .max(160, "Description must be at most 160 characters.")
        .optional(),
    language: z
        .string({ error: "Language is required!" })
        .min(1, "Language cannot be empty."),
    is_public: z.boolean().default(false).optional(),
    content: z
        .string({ error: "Content is required!" })
        .trim()
        .min(5, "Content should be at least 5 characters."),
    tags: z.array(
        z.string()
            .trim()
            .min(1, "Each tag must be at least 1 character.")
            .max(20, "Each tag must be at most 20 characters.")
    ).optional(),
});

export type CreateEditSnippetValues = z.infer<typeof createEditSnippetSchema>;