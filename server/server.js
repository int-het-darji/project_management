const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

/* MIDDLEWARES */
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/projects', require('./routes/project.route'))
app.use("/api/projects/activity", require('./routes/activity.route'));

/*HEALTH CHECK */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    db: "CONNECTED",
  });
});

/*  ROUTES */


/* SERVER */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" PostgreSQL connection failed:", err.message);
    process.exit(1);
  }
})();
