// const express = require("express");
// const router = express.Router();
// const pool = require("../config/db");
// const authMiddleware = require("../middlewares/auth");
// const adminMiddleware = require("../middlewares/admin.middleware");
// const {
//   createProject,
//   deleteProject,
//   getProjects,
//   getProjectById,
//   getUserProjects,
//   assignUserToProject,
//   unassignUserFromProject,
//   getProjectActivities
// } = require("../controllers/project.controller");


// router.get(
//   "/projects",
//   authMiddleware,
//   adminMiddleware,
//   async (req, res) => {
//     const result = await pool.query("SELECT * FROM projects");
//     res.json(result.rows);
//   }
// );

// router.get("/my-projects", authMiddleware, getUserProjects);

// router.get("/", authMiddleware, getProjects);
// router.post("/", authMiddleware, adminMiddleware, createProject);
// router.delete("/:id", authMiddleware, adminMiddleware, deleteProject);
// router.get("/:id", authMiddleware, getProjectById);

// router.post("/:projectId/assign/:userId", authMiddleware, adminMiddleware, assignUserToProject);
// router.delete("/:projectId/assign/:userId", authMiddleware, adminMiddleware, unassignUserFromProject);
// router.get("/:projectId/activities", authMiddleware, getProjectActivities);

// module.exports = router;




const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin.middleware");
const {
  createProject,
  deleteProject,
  getProjects,
  getProjectById,
  getUserProjects,
  assignUserToProject,
  unassignUserFromProject,
  getProjectActivities
} = require("../controllers/project.controller");

// IMPORTANT: Order matters! Put specific routes before dynamic routes

// Get user's assigned projects (for regular users)
router.get("/my-projects", authMiddleware, getUserProjects);

// Get all projects (admin only) - this should come before /:id
router.get("/", authMiddleware, getProjects); // getProjects now checks role internally

// Get single project by ID (with access control)
router.get("/:id", authMiddleware, getProjectById);

// Create project (admin only)
router.post("/", authMiddleware, adminMiddleware, createProject);

// Delete project (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProject);

// Assignment routes (admin only)
router.post("/:projectId/assign/:userId", authMiddleware, adminMiddleware, assignUserToProject);
router.delete("/:projectId/assign/:userId", authMiddleware, adminMiddleware, unassignUserFromProject);

// Activities route
router.get("/:projectId/activities", authMiddleware, getProjectActivities);

module.exports = router;