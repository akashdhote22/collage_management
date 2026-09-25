import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Authentication and Layout
import Login from "./pages/login";
import ProtectedRoute from "./components/protectedRoute";
import RoleRoute from "./components/roleRoute";
import DashboardLayout from "./components/DashboardLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/adminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTeachers from "./pages/admin/AdminTeachers";
import AdminCourses from "./pages/admin/Courses";
import AdminFees from "./pages/admin/Fees";
import AdminUsers from "./pages/admin/Users";
import Attendance from "./pages/admin/Attendance";
import Timetable from "./pages/admin/Timetable";
import Notices from "./pages/admin/Notices";
import Results from "./pages/admin/results";
import BookIssue from "./pages/admin/BookIssue";
import BookManagement from "./pages/admin/BookManagement";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/teacherDashboard";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherAttendance from "./pages/teacher/TeacherAttendance";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import TeacherNotices from "./pages/teacher/TeacherNotices";

// Student Pages
import StudentDashboard from "./pages/student/studentDashboard";
import StudentCourses from "./pages/student/StudentCourses";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentFees from "./pages/student/StudentFees";
import StudentLibrary from "./pages/student/StudentLibrary";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* All Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* ================= ADMIN ROUTES ================= */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<DashboardLayout />}>
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/students"
                element={<AdminStudents />}
              />

              <Route
                path="/admin/teachers"
                element={<AdminTeachers />}
              />

              <Route
                path="/admin/courses"
                element={<AdminCourses />}
              />

              <Route
                path="/admin/fees"
                element={<AdminFees />}
              />

              <Route
                path="/admin/users"
                element={<AdminUsers />}
              />

              <Route
                path="/admin/attendance"
                element={<Attendance />}
              />

              <Route
                path="/admin/timetable"
                element={<Timetable />}
              />

              <Route
                path="/admin/notices"
                element={<Notices />}
              />
              <Route
  path="/admin/results"
  element={<Results />}
/>

<Route
  path="/admin/BookIssue"
  element={<BookIssue />}
/>
<Route
  path="/admin/BookManagement"
  element={<BookManagement />}
/>
<Route
  path="/student/library"
  element={<StudentLibrary />}
/>

            </Route>
          </Route>

          {/* ================= TEACHER ROUTES ================= */}
          <Route element={<RoleRoute allowedRoles={["teacher"]} />}>
            <Route
              path="/teacher/dashboard"
              element={<TeacherDashboard />}
            />

            <Route
              path="/teacher/courses"
              element={<TeacherCourses />}
            />

            <Route
              path="/teacher/attendance"
              element={<TeacherAttendance />}
            />

            <Route
              path="/teacher/timetable"
              element={<TeacherTimetable />}
            />

            <Route
              path="/teacher/notices"
              element={<TeacherNotices />}
            />
          </Route>

          {/* ================= STUDENT ROUTES ================= */}
          <Route element={<RoleRoute allowedRoles={["student"]} />}>
            <Route
              path="/student/dashboard"
              element={<StudentDashboard />}
            />

            <Route
              path="/student/courses"
              element={<StudentCourses />}
            />

            <Route
              path="/student/attendance"
              element={<StudentAttendance />}
            />

            <Route
              path="/student/fees"
              element={<StudentFees />}
            />
          </Route>
        </Route>

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown Route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;