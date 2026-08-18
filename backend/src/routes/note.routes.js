const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const {
  createNoteValidation,
  updateNoteValidation,
} = require("../validators/noteValidator");
const { listNotesValidation } = require("../validators/noteQueryValidator");

const router = express.Router();

router.use(authMiddleware);

router.get("/", listNotesValidation, validateRequest, noteController.list);
router.get("/:id", noteController.getById);
router.post("/", createNoteValidation, validateRequest, noteController.create);
router.put(
  "/:id",
  updateNoteValidation,
  validateRequest,
  noteController.update,
);
router.delete("/:id", noteController.remove);

module.exports = router;
