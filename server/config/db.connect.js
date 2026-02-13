const pool = require('./db');

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL (Supabase) connected successfully');
    client.release();
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
