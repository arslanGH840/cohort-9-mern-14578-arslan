import { z } from "zod";

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  body: z.string().trim().min(1, "Note content cannot be empty"),
});
