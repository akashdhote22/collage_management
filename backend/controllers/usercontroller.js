const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide currentPassword and newPassword",
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long",
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Compare current password
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Check whether new password is same as old password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL USERS - ADMIN ONLY
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE USER - ADMIN ONLY
const getUserById = async (req, res) => {
  try {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid user ID",
  });
}

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE USER ROLE - ADMIN ONLY
const updateUserRole = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid user ID",
  });
}
    const { role } = req.body;

    // Validate role
    const allowedRoles = ["admin", "teacher", "student"];

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Role must be admin, teacher or student",
      });
    }

    // Find user
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update role
    user.role = role;

    await user.save();

    // Remove password from response
    const updatedUser = await User.findById(user._id).select(
      "-password"
    );

    res.status(200).json({
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE USER - ADMIN ONLY
const deleteUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  return res.status(400).json({
    message: "Invalid user ID",
  });
}
    const userId = req.params.id;

    // Prevent admin from deleting himself
    if (String(req.user.userId) === String(userId)) {
  return res.status(400).json({
    message: "You cannot delete your own account",
  });
}
    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  changePassword,
  getUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
