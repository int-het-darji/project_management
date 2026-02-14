const pool = require("../config/db");


// GET ACTIVITIES BY PROJECT
exports.getProjectActivities = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT a.*, u.name as created_by_name
       FROM activities a
       JOIN users u ON u.id = a.created_by
       WHERE a.project_id = $1
       ORDER BY a.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// CREATE ACTIVITY
exports.createActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || title.trim().length < 3)
      return res.status(400).json({ message: "Title must be 3 characters" });

    const result = await pool.query(
      `INSERT INTO activities (project_id,title,description,created_by)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [id, title, description, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE STATUS
exports.updateActivityStatus = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE activities SET status=$1 WHERE id=$2 RETURNING *`,
      [status, activityId]
    );

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE
exports.deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    await pool.query(`DELETE FROM activities WHERE id=$1`, [activityId]);

    res.json({ message: "Activity deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
