const { param } = require("express-validator");

const noteIdValidation = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Note id must be a positive integer"),
];

module.exports = { noteIdValidation };
