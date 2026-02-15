const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  getProjectActivities,
  createActivity,
  updateActivityStatus,
  deleteActivity,
  getActivityById
} = require("../controllers/activity.controller");

router.get("/projects/:id/activities", auth, getProjectActivities);
router.post("/projects/:id/activities", auth, createActivity);
router.patch("/:activityId", auth, updateActivityStatus);
router.delete("/:activityId", auth, deleteActivity);
router.get("/activities/:activityId", auth, getActivityById);


module.exports = router;
