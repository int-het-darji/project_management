const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST, // db.xxxx.supabase.co
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4, // 👈 FORCE IPv4 (IMPORTANT)
});

module.exports = pool;
