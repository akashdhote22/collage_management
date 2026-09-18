const express = require("express");

const protect = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/rolemiddleware");

const {
  createFee,
  getFees,
  getFeesByStudent,
  getFeeById,
  updateFee,
  deleteFee,
  getStudentFees,
} = require("../controllers/feecontroller");

const router = express.Router();

// Only Admin can manage fees

// CREATE FEE
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createFee
);

// GET ALL FEES
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getFees
);

// GET FEES BY STUDENT
router.get(
  "/student/:studentId",
  protect,
  authorizeRoles("admin"),
  getFeesByStudent
);

// GET SINGLE FEE
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getFeeById
);

// UPDATE FEE
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateFee
);

// DELETE FEE
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteFee
);
router.get(
  "/student",
  protect,
  authorizeRoles("student"),
  getStudentFees
);

module.exports = router;