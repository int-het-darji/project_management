const pool = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
  
    const [projectsRes, usersRes, activitiesRes] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int FROM projects`),
      pool.query(`SELECT COUNT(*)::int FROM users`),
      pool.query(`SELECT COUNT(*)::int FROM activities`),
    ]);

    const activeProjectsRes = await pool.query(`
      SELECT COUNT(*)::int
      FROM projects
      WHERE status::text != 'completed'
    `);

   
    const projectStatusRes = await pool.query(`
      SELECT
        status::text AS name,
        COUNT(*)::int AS value
      FROM projects
      GROUP BY status
    `);

 
    const activityStatusRes = await pool.query(`
      SELECT
        status::text AS name,
        COUNT(*)::int AS value
      FROM activities
      GROUP BY status
    `);

    
    const projectGrowthRes = await pool.query(`
      SELECT
        TO_CHAR(created_at, 'Mon') AS month,
        COUNT(*)::int AS value
      FROM projects
      GROUP BY month
      ORDER BY MIN(created_at)
    `);

  
    const recentActivitiesRes = await pool.query(`
      SELECT
        a.id,
        a.title,
        a.status::text AS status,
        a.created_at,
        u.username,
        p.name AS project
      FROM activities a
      JOIN users u ON u.id = a.created_by
      JOIN projects p ON p.id = a.project_id
      ORDER BY a.created_at DESC
      LIMIT 6
    `);

    res.json({
      kpis: {
        totalProjects: projectsRes.rows[0].count,
        activeProjects: activeProjectsRes.rows[0].count,
        totalUsers: usersRes.rows[0].count,
        totalActivities: activitiesRes.rows[0].count,
      },
      charts: {
        projectStatus: projectStatusRes.rows,
        activityStatus: activityStatusRes.rows,
        projectGrowth: projectGrowthRes.rows,
      },
      recentActivities: recentActivitiesRes.rows,
    });
  } catch (error) {
    console.error("ADMIN DASHBOARD ERROR ", error);
    res.status(500).json({
      message: "Dashboard error",
      error: error.message,
    });
  }
};

exports.getProgress = async (req, res) => {
  try {
    /* ===== PROJECT PROGRESS ===== */
    const projectProgressQuery = `
      SELECT 
        p.id,
        p.name,
        p.status,
        COUNT(a.id) AS total_activities,
        COUNT(a.id) FILTER (WHERE a.status = 'done') AS completed_activities,
        ROUND(
          (COUNT(a.id) FILTER (WHERE a.status = 'done')::decimal /
          NULLIF(COUNT(a.id), 0)) * 100, 0
        ) AS progress
      FROM projects p
      LEFT JOIN activities a ON a.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `;

    /* ===== USER WORKLOAD ===== */
    const userProgressQuery = `
      SELECT
        u.id,
        u.username,
        COUNT(DISTINCT pa.project_id) AS projects,
        COUNT(a.id) AS activities,
        COUNT(a.id) FILTER (WHERE a.status = 'done') AS completed
      FROM users u
      LEFT JOIN project_assign pa ON pa.user_id = u.id
      LEFT JOIN activities a ON a.created_by = u.id
      GROUP BY u.id;
    `;

    /* ===== OVERALL ACTIVITY STATUS ===== */
    const activityStatusQuery = `
      SELECT status, COUNT(*) AS count
      FROM activities
      GROUP BY status;
    `;

    const [
      projectProgress,
      userProgress,
      activityStatus,
    ] = await Promise.all([
      pool.query(projectProgressQuery),
      pool.query(userProgressQuery),
      pool.query(activityStatusQuery),
    ]);

    res.json({
      projects: projectProgress.rows,
      users: userProgress.rows,
      activityStatus: activityStatus.rows,
    });
  } catch (error) {
    console.error("PROGRESS ERROR ", error);
    res.status(500).json({ message: "Progress error" });
  }
};

