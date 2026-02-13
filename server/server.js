const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db.connect");

const app = express();

/* ================= MIDDLEWARES ================= */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ================= HEALTH CHECK ================= */

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    db: "CONNECTED",
  });
});

/* ================= ROUTES ================= */

app.use("/api", require("./routes/test.route"));

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
