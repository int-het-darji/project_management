const pool = require("../config/db");


// CREATE PROJECT
exports.createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;

    if (!name)
      return res.status(400).json({ message: "Project name required" });

    const result = await pool.query(
      `INSERT INTO projects
       (name, description, start_date, end_date, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [
        name,
        description,
        start_date,
        end_date,
        status || "pending",
        req.user.id,
      ]
    );

    res.status(201).json({
      message: "Project created",
      project: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE PROJECT
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM projects WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Project not found" });

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL PROJECTS
exports.getProjects = async (req, res) => {
  const result = await pool.query(`SELECT * FROM projects ORDER BY id DESC`);
  res.json(result.rows);
};

// get signgle project
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT p.*, u.name as created_by_name
       FROM projects p
       JOIN users u ON u.id = p.created_by
       WHERE p.id = $1`,
      [id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Project not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};