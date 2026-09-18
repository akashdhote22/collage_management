const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createNotice,
  getNotices,
  getActiveNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticecontroller");

const router = express.Router();

// CREATE NOTICE - Only Admin
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createNotice
);

// GET ALL NOTICES - All Roles
router.get(
  "/",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getNotices
);

// GET ACTIVE NOTICES - All Roles
router.get(
  "/active",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getActiveNotices
);

// GET SINGLE NOTICE - All Roles
router.get(
  "/:id",
  protect,
  authorizeRoles("admin", "teacher", "student"),
  getNoticeById
);

// UPDATE NOTICE - Only Admin
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateNotice
);

// DELETE NOTICE - Only Admin
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteNotice
);

module.exports = router;