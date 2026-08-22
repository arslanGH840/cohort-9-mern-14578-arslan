import { z } from "zod";

function isVisuallyEmpty(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = (div.textContent || div.innerText || "")
    .replace(/\u00A0/g, " ")
    .trim();
  return text.length === 0;
}

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  body: z.string().refine((value) => !isVisuallyEmpty(value), {
    message: "Note content cannot be empty",
  }),
});
