const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin.middleware");
const {
  createProject,
  deleteProject,
  getProjects,
  getProjectById,
  assignUserToProject,
  unassignUserFromProject,
  getProjectActivities
} = require("../controllers/project.controller");


router.get(
  "/projects",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  }
);


router.get("/", authMiddleware, getProjects);
router.post("/", authMiddleware, adminMiddleware, createProject);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProject);
router.get("/:id", authMiddleware, getProjectById);

router.post("/:projectId/assign/:userId", authMiddleware, adminMiddleware, assignUserToProject);
router.delete("/:projectId/assign/:userId", authMiddleware, adminMiddleware, unassignUserFromProject);
router.get("/:projectId/activities", authMiddleware, getProjectActivities);

module.exports = router;