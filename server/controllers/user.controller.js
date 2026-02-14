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

    const user = result.rows[0];
    if (user.created_at) {
      user.created_at = user.created_at.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    res.status(201).json(user);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

/* GET ALL USERS */
/* GET ALL USERS */
exports.getAllUsers = async (req, res) => {
  try {
    const { search = '' } = req.query;

    let query = `
      SELECT 
        id,
        username,
        name,
        email,
        role,
        created_at,
        is_assigned
      FROM users
    `;
    
    const queryParams = [];

    if (search) {
      query += `
        WHERE 
          username ILIKE $1 OR 
          name ILIKE $1 OR 
          email ILIKE $1
      `;
      queryParams.push(`%${search}%`);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    // Use a single result variable
    const result = await pool.query(query, queryParams);

    const formattedUsers = result.rows.map(user => {
      if (user.created_at) {
        user.created_at = user.created_at.toLocaleString('en-IN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return user;
    });

    res.json(formattedUsers);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        id,
        username,
        name,
        email,
        role,
        created_at,
        is_assigned,
        password_reset_required
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];
    if (user.created_at) {
      user.created_at = user.created_at.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};


exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, name, role } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET username = COALESCE($1, username),
          email = COALESCE($2, email),
          name = COALESCE($3, name),
          role = COALESCE($4, role),
          updated_at = NOW()
      WHERE id = $5
      RETURNING id, username, email, name, role, created_at, updated_at
      `,
      [username, email, name, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];
    if (user.created_at) {
      user.created_at = user.created_at.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (user.updated_at) {
      user.updated_at = user.updated_at.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({
      message: "Failed to update user",
    });
  }
};


/* DELETE USER */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      UPDATE users
      SET password = $1,
          password_reset_required = false,
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, username, email
      `,
      [hashedPassword, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Password updated successfully",
      user: result.rows[0]
    });
    
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({
      message: "Failed to reset password",
    });
  }
};


/* CHANGE PASSWORD (for logged-in users) */
exports.changePassword = async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Current password and new password are required",
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    // Get user with current password
    const result = await pool.query(
      "SELECT id, password FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = result.rows[0];

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      `
      UPDATE users
      SET password = $1,
          password_reset_required = false,
          updated_at = NOW()
      WHERE id = $2
      `,
      [hashedPassword, id]
    );

    res.json({
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({
      message: "Failed to change password",
    });
  }
};
