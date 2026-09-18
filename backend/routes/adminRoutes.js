const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  adminDashboard,
} = require("../controllers/admincontroller");

const {
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/usercontroller");

const router = express.Router();

// ADMIN DASHBOARD
router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  adminDashboard
);

// GET ALL USERS - ADMIN ONLY
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  getUsers
);

// GET SINGLE USER - ADMIN ONLY
router.get(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);

// UPDATE USER ROLE - ADMIN ONLY
router.put(
  "/users/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

// DELETE USER - ADMIN ONLY
router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;