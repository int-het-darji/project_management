const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/db-test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

module.exports = router;
