const { body } = require("express-validator");

const createNoteValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),

  body("body").notEmpty().withMessage("Body is required"),
];

const updateNoteValidation = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),

  body("body").optional().notEmpty().withMessage("Body cannot be empty"),
];

module.exports = { createNoteValidation, updateNoteValidation };
