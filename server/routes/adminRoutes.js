const express = require("express");
const router = express.Router();

// ✅ middlewares
const auth = require("../middlewares/auth"); // auth.js
const admin = require("../middlewares/admin.middleware");

// ✅ controller
const adminController = require("../controllers/admin.controller");

// =========================
// ADMIN DASHBOARD ROUTE
// =========================
router.get(
  "/dashboard",
  auth,
  admin,
  adminController.getDashboard
);

module.exports = router;
