const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  getCommentsByActivity,
  createComment,
} = require("../controllers/comment.controller");

router.get("/activities/:activityId/comments", auth, getCommentsByActivity);
router.post("/activities/:activityId/comments", auth, createComment);

module.exports = router;
