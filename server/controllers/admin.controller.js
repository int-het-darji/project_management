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
