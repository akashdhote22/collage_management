const Notice = require("../models/notice");

// CREATE NOTICE
const createNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAudience,
      publishDate,
      expiryDate,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Please provide title and description",
      });
    }

    if (publishDate && expiryDate) {
      if (new Date(expiryDate) < new Date(publishDate)) {
        return res.status(400).json({
          message: "Expiry date cannot be before publish date",
        });
      }
    }

    const notice = await Notice.create({
      title,
      description,
      targetAudience: targetAudience || "all",
      publishDate: publishDate || new Date(),
      expiryDate,
      createdBy: req.user.userId,
    });

    const populatedNotice = await Notice.findById(notice._id).populate(
      "createdBy",
      "name email role"
    );

    res.status(201).json({
      message: "Notice created successfully",
      notice: populatedNotice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ALL NOTICES
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate("createdBy", "name email role")
      .sort({ publishDate: -1 });

    res.status(200).json({
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ACTIVE NOTICES
const getActiveNotices = async (req, res) => {
  try {
    const currentDate = new Date();

    const notices = await Notice.find({
      publishDate: { $lte: currentDate },

      $and: [
        // Expiry condition
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: currentDate } },
          ],
        },

        // Target audience condition
        {
          $or: [
            { targetAudience: "all" },
            { targetAudience: req.user.role },
            {
              targetAudience:
                req.user.role === "student"
                  ? "students"
                  : req.user.role === "teacher"
                  ? "teachers"
                  : "admin",
            },
          ],
        },
      ],
    })
      .populate("createdBy", "name email role")
      .sort({ publishDate: -1 });

    res.status(200).json({
      count: notices.length,
      notices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SINGLE NOTICE
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      notice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE NOTICE
const updateNotice = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAudience,
      publishDate,
      expiryDate,
    } = req.body;

    if (publishDate && expiryDate) {
      if (new Date(expiryDate) < new Date(publishDate)) {
        return res.status(400).json({
          message: "Expiry date cannot be before publish date",
        });
      }
    }

    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        targetAudience,
        publishDate,
        expiryDate,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("createdBy", "name email role");

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice updated successfully",
      notice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE NOTICE
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found",
      });
    }

    res.status(200).json({
      message: "Notice deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createNotice,
  getNotices,
  getActiveNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
};