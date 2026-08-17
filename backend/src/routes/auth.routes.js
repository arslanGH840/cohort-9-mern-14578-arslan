const express = require("express");
const authController = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/authMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../validators/authValidator");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validateRequest,
  authController.register,
);
router.post("/login", loginValidation, validateRequest, authController.login);
router.get("/me", authMiddleware, authController.me);
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;
