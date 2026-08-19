const { query } = require("express-validator");

const ALLOWED_SORT_FIELDS = ["title", "created_at", "updated_at"];
const MAX_PAGE_SIZE = 100;

const listNotesValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),

  query("pageSize")
    .optional()
    .isInt({ min: 1, max: MAX_PAGE_SIZE })
    .withMessage(`pageSize must be between 1 and ${MAX_PAGE_SIZE}`),

  query("sortBy")
    .optional()
    .isIn(ALLOWED_SORT_FIELDS)
    .withMessage(`sortBy must be one of: ${ALLOWED_SORT_FIELDS.join(", ")}`),

  query("order")
    .optional()
    .toUpperCase()
    .isIn(["ASC", "DESC"])
    .withMessage("order must be 'asc' or 'desc'"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage("search must be at most 255 characters"),
];

module.exports = { listNotesValidation };
