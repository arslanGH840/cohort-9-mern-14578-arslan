const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createNoteValidation,
  updateNoteValidation,
} = require("../validators/noteValidator");
const { listNotesValidation } = require("../validators/noteQueryValidator");
const { noteIdValidation } = require("../validators/noteParamValidator");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listNotesValidation, validateRequest, noteController.list);
router.get("/:id", noteIdValidation, validateRequest, noteController.getById);
router.post("/", createNoteValidation, validateRequest, noteController.create);
router.put(
  "/:id",
  noteIdValidation,
  updateNoteValidation,
  validateRequest,
  noteController.update,
);
router.delete("/:id", noteIdValidation, validateRequest, noteController.remove);

module.exports = router;
