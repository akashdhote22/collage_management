const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  getProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/usercontroller");

const router = express.Router();

// GET PROFILE
router.get("/profile", protect, getProfile);

// CHANGE PASSWORD
router.put("/change-password", protect, changePassword);

// GET ALL USERS - ADMIN ONLY
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getUsers
);

// GET SINGLE USER - ADMIN ONLY
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);

// UPDATE USER ROLE - ADMIN ONLY
router.put(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

// DELETE USER - ADMIN ONLY
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;