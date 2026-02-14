const express = require("express");
const router = express.Router();


const auth = require("../middlewares/auth"); // auth.js
const admin = require("../middlewares/admin.middleware");


const adminController = require("../controllers/admin.controller");


router.get(
  "/dashboard",
  auth,
  admin,
  adminController.getDashboard
);
router.get(
  "/progress",
  auth,
  admin,
  adminController.getProgress
);

module.exports = router;
