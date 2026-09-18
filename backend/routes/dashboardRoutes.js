const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  getDashboardStats,
} = require("../controllers/dashboardcontroller");

const router = express.Router();

// GET DASHBOARD STATISTICS - Only Admin
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getDashboardStats
);

module.exports = router;