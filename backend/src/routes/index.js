const express = require("express");
const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const noteRoutes = require("./note.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/notes", noteRoutes);

module.exports = router;
