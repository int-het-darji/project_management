const bcrypt = require("bcryptjs");
const pool = require("../config/db");

/* CREATE USER */
exports.createUser = async (req, res) => {
  const { username, email, password, role, name } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Required fields missing",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users 
      (username, email, password, role, name, password_reset_required)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING id, username, email, role, name, created_at
      `,
      [username, email, hashedPassword, role || "user", name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

/* GET ALL USERS */
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        username,
        name,
        email,
        role,
        created_at,
        is_assigned
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

/* DELETE USER */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
};

/* RESET PASSWORD (FORGOT PASSWORD BY ADMIN) */
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1,
          password_reset_required = false
      WHERE id = $2
      `,
      [hashedPassword, id]
    );

    res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      message: "Failed to reset password",
    });
  }
};
