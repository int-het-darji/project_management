const pool = require("../config/db");


// GET COMMENTS BY ACTIVITY
exports.getCommentsByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.name as user_name
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.activity_id = $1
       ORDER BY c.created_at ASC`,
      [activityId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// CREATE COMMENT
exports.createComment = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length < 1)
      return res.status(400).json({ message: "Comment cannot be empty" });

    const result = await pool.query(
      `INSERT INTO comments (activity_id, user_id, message)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [activityId, req.user.id, message]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};