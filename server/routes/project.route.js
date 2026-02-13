const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

router.get(
  "/projects",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  }
);

module.exports = router;
