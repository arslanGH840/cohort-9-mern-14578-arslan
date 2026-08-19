const { body } = require("express-validator");

const createNoteValidation = [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),

  body("body")
    .isString()
    .withMessage("Body must be a string")
    .bail()
    .custom((value) => value.trim().length > 0)
    .withMessage("Body cannot be empty"),
];

const updateNoteValidation = [
  body("title")
    .optional()
    .isString()
    .withMessage("Title must be a string")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 255 })
    .withMessage("Title must be at most 255 characters"),

  body("body")
    .optional()
    .isString()
    .withMessage("Body must be a string")
    .bail()
    .custom((value) => value.trim().length > 0)
    .withMessage("Body cannot be empty"),
];

module.exports = { createNoteValidation, updateNoteValidation };
