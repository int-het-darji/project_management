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
  try {
    const result = await pool.query(`SELECT * FROM projects ORDER BY id DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// get signgle project with assigned users
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { search = '' } = req.query;

    const projectResult = await pool.query(
      `SELECT p.*, u.username as created_by_name
       FROM projects p
       JOIN users u ON u.id = p.created_by
       WHERE p.id = $1`,
      [id]
    );

    if (projectResult.rowCount === 0)
      return res.status(404).json({ message: "Project not found" });

    const project = projectResult.rows[0];

    // Get all users with assignment status
    let usersQuery = `
      SELECT 
        u.id,
        u.username,
        u.name,
        u.email,
        u.role,
        CASE WHEN pa.user_id IS NOT NULL THEN true ELSE false END as is_assigned
      FROM users u
      LEFT JOIN project_assign pa ON pa.user_id = u.id AND pa.project_id = $1
    `;

    const queryParams = [id];
    
    // Add search if provided
    if (search) {
      usersQuery += `
        WHERE 
          u.username ILIKE $2 OR 
          u.name ILIKE $2 OR 
          u.email ILIKE $2
      `;
      queryParams.push(`%${search}%`);
    }
    
    usersQuery += ` ORDER BY u.created_at DESC`;
    
    const usersResult = await pool.query(usersQuery, queryParams);
    project.assigned_users = usersResult.rows;

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ASSIGN USER TO PROJECT
exports.assignUserToProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Check if assignment already exists
    const checkResult = await pool.query(
      "SELECT id FROM project_assign WHERE project_id = $1 AND user_id = $2",
      [projectId, userId]
    );

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already assigned to this project" });
    }

    // Create assignment
    await pool.query(
      "INSERT INTO project_assign (project_id, user_id) VALUES ($1, $2)",
      [projectId, userId]
    );

    // Update user's is_assigned flag
    await pool.query(
      "UPDATE users SET is_assigned = true WHERE id = $1",
      [userId]
    );

    res.json({ message: "User assigned successfully" });
  } catch (err) {
    console.error("Assign user error:", err);
    res.status(500).json({ message: "Failed to assign user" });
  }
};

// UNASSIGN USER FROM PROJECT
exports.unassignUserFromProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    // Delete assignment
    const result = await pool.query(
      "DELETE FROM project_assign WHERE project_id = $1 AND user_id = $2 RETURNING id",
      [projectId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if user is assigned to any other project
    const otherAssignments = await pool.query(
      "SELECT id FROM project_assign WHERE user_id = $1 LIMIT 1",
      [userId]
    );

    // If no other assignments, update user's is_assigned flag
    if (otherAssignments.rows.length === 0) {
      await pool.query(
        "UPDATE users SET is_assigned = false WHERE id = $1",
        [userId]
      );
    }

    res.json({ message: "User unassigned successfully" });
  } catch (err) {
    console.error("Unassign user error:", err);
    res.status(500).json({ message: "Failed to unassign user" });
  }
};

// GET PROJECT ACTIVITIES
exports.getProjectActivities = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT 
        a.*,
        u.username as created_by_name
       FROM activities a
       JOIN users u ON u.id = a.created_by
       WHERE a.project_id = $1
       ORDER BY a.created_at DESC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};