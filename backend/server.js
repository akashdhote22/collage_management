const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const courseRoutes = require("./routes/courseRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const feeRoutes = require("./routes/feeRoutes");
const resultRoutes = require("./routes/resultRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const bookRoutes = require("./routes/bookRoutes");
const bookIssueRoutes = require("./routes/bookissueRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/book-issues", bookIssueRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Test Route
app.get("/", (req, res) => {
  res.send("College Management Backend is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});