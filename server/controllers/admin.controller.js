const pool = require("../config/db");

/* =======================
   ADMIN DASHBOARD
======================= */
exports.getDashboard = async (req, res) => {
  try {
    const [
      projectsRes,
      usersRes,
      activitiesRes,
      activeProjectsRes,
      projectStatusRes,
      activityStatusRes,
      projectGrowthRes,
      recentActivitiesRes,
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*)::int FROM projects`),
      pool.query(`SELECT COUNT(*)::int FROM users`),
      pool.query(`SELECT COUNT(*)::int FROM activities`),

      pool.query(`
        SELECT COUNT(*)::int
        FROM projects
        WHERE status::text != 'completed'
      `),

      pool.query(`
        SELECT
          status::text AS name,
          COUNT(*)::int AS value
        FROM projects
        GROUP BY status
      `),

      pool.query(`
        SELECT
          status::text AS name,
          COUNT(*)::int AS value
        FROM activities
        GROUP BY status
      `),

      pool.query(`
        SELECT
          TO_CHAR(created_at, 'Mon') AS month,
          COUNT(*)::int AS value
        FROM projects
        GROUP BY month
        ORDER BY MIN(created_at)
      `),

      pool.query(`
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
      `),
    ]);

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
    console.error("ADMIN DASHBOARD ERROR 🔴", error);
    res.status(500).json({
      message: "Dashboard error",
      error: error.message,
    });
  }
};

/* =======================
   ADMIN PROGRESS
======================= */
exports.getProgress = async (req, res) => {
  try {
    const {
      project = "",
      user = "",
      from = "",
      to = "",
    } = req.query;

    /* ===== PROJECT PROGRESS ===== */
    const projectProgressQuery = `
      SELECT 
        p.id,
        p.name,
        p.status::text AS status,
        COUNT(a.id)::int AS total_activities,
        COUNT(a.id) FILTER (WHERE a.status = 'done')::int AS completed_activities,
        COALESCE(
          ROUND(
            (COUNT(a.id) FILTER (WHERE a.status = 'done')::decimal /
            NULLIF(COUNT(a.id), 0)) * 100
          ), 0
        )::int AS progress
      FROM projects p
      LEFT JOIN activities a ON a.project_id = p.id
      WHERE
        p.name ILIKE '%' || $1 || '%'
        AND ($2 = '' OR p.created_at >= $2::date)
        AND ($3 = '' OR p.created_at <= $3::date)
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `;

    /* ===== USER WORKLOAD ===== */
    const userProgressQuery = `
      SELECT
        u.id,
        u.username,
        COUNT(DISTINCT pa.project_id)::int AS projects,
        COUNT(a.id)::int AS activities,
        COUNT(a.id) FILTER (WHERE a.status = 'done')::int AS completed
      FROM users u
      LEFT JOIN project_assign pa ON pa.user_id = u.id
      LEFT JOIN activities a ON a.created_by = u.id
      WHERE
        u.username ILIKE '%' || $1 || '%'
      GROUP BY u.id
      ORDER BY u.username;
    `;

    /* ===== ACTIVITY STATUS ===== */
    const activityStatusQuery = `
      SELECT
        status::text AS status,
        COUNT(*)::int AS count
      FROM activities
      GROUP BY status;
    `;

    const [projects, users, activityStatus] = await Promise.all([
      pool.query(projectProgressQuery, [
        project,
        from,
        to,
      ]),
      pool.query(userProgressQuery, [user]),
      pool.query(activityStatusQuery),
    ]);

    res.json({
      projects: projects.rows,
      users: users.rows,
      activityStatus: activityStatus.rows,
    });
  } catch (error) {
    console.error("PROGRESS ERROR 🔴", error);
    res.status(500).json({
      message: "Progress error",
      error: error.message,
    });
  }
};

exports.exportProgressCSV = async (req, res) => {
  try {
    const query = `
      SELECT
        p.name                    AS project_name,
        p.status::text            AS project_status,
        u.username                AS username,
        COUNT(a.id)::int          AS total_activities,
        COUNT(a.id) FILTER (WHERE a.status = 'done')::int AS completed_activities,
        (COUNT(a.id) - COUNT(a.id) FILTER (WHERE a.status = 'done'))::int AS pending_activities,
        COALESCE(
          ROUND(
            (COUNT(a.id) FILTER (WHERE a.status = 'done')::decimal /
            NULLIF(COUNT(a.id), 0)) * 100
          ), 0
        )::int AS progress_percent
      FROM projects p
      JOIN project_assign pa ON pa.project_id = p.id
      JOIN users u ON u.id = pa.user_id
      LEFT JOIN activities a 
        ON a.project_id = p.id AND a.created_by = u.id
      GROUP BY p.id, u.id
      ORDER BY p.name, u.username;
    `;

    const { rows } = await pool.query(query);

    // Convert to CSV
    const headers = Object.keys(rows[0] || {}).join(",");
    const csvRows = rows.map(r =>
      Object.values(r)
        .map(v => `"${v ?? ""}"`)
        .join(",")
    );

    const csv = [headers, ...csvRows].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=project-progress.csv"
    );

    res.send(csv);
  } catch (error) {
    console.error("CSV EXPORT ERROR 🔴", error);
    res.status(500).json({ message: "CSV export failed" });
  }
};
