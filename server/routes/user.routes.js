const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin.middleware");
const userController = require("../controllers/user.controller");

/* ADMIN ONLY – USERS CRUD */

router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);

router.post("/", authMiddleware, adminMiddleware, userController.createUser);

router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);

router.patch(
  "/:id/reset-password",
  authMiddleware,
  adminMiddleware,
  userController.resetPassword
);

module.exports = router;
