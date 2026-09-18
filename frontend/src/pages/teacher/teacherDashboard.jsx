import { useEffect, useState } from "react";

import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Megaphone,
  Users,
} from "lucide-react";

import api from "../../services/api";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalAttendance: 0,
    totalNotices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/teachers/dashboard");
        const data = response.data;

        setStats({
          totalCourses: data.stats?.totalCourses || 0,
          totalStudents: data.stats?.totalStudents || 0,
          totalAttendance: data.stats?.totalAttendance || 0,
          totalNotices: data.stats?.totalNotices || 0,
        });
      } catch (error) {
        console.error("Teacher dashboard error:", error);

        // If API fails, display zero values
        setStats({
          totalCourses: 0,
          totalStudents: 0,
          totalAttendance: 0,
          totalNotices: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Assigned Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Attendance Records",
      value: stats.totalAttendance,
      icon: ClipboardCheck,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Active Notices",
      value: stats.totalNotices,
      icon: Megaphone,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Teacher Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome to your teaching management dashboard
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
          Loading dashboard...
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {card.title}
                      </p>

                      <h2 className="mt-2 text-3xl font-bold text-slate-800">
                        {card.value}
                      </h2>
                    </div>

                    <div className={`rounded-xl p-3 ${card.color}`}>
                      <Icon size={25} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CalendarDays className="text-blue-600" size={22} />

                <h2 className="text-lg font-semibold text-slate-800">
                  Quick Actions
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    window.location.href = "/teacher/attendance";
                  }}
                  className="rounded-lg bg-blue-50 px-4 py-3 text-left font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  Mark Attendance
                </button>

                <button
                  onClick={() => {
                    window.location.href = "/teacher/courses";
                  }}
                  className="rounded-lg bg-purple-50 px-4 py-3 text-left font-medium text-purple-700 transition hover:bg-purple-100"
                >
                  View Courses
                </button>

                <button
                  onClick={() => {
                    window.location.href = "/teacher/timetable";
                  }}
                  className="rounded-lg bg-green-50 px-4 py-3 text-left font-medium text-green-700 transition hover:bg-green-100"
                >
                  View Timetable
                </button>

                <button
                  onClick={() => {
                    window.location.href = "/teacher/notices";
                  }}
                  className="rounded-lg bg-orange-50 px-4 py-3 text-left font-medium text-orange-700 transition hover:bg-orange-100"
                >
                  View Notices
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ClipboardCheck className="text-green-600" size={22} />

                <h2 className="text-lg font-semibold text-slate-800">
                  Teaching Overview
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-slate-600">
                    Assigned Courses
                  </span>

                  <span className="font-semibold text-slate-800">
                    {stats.totalCourses}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-slate-600">
                    Students Under Guidance
                  </span>

                  <span className="font-semibold text-slate-800">
                    {stats.totalStudents}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    Attendance Entries
                  </span>

                  <span className="font-semibold text-slate-800">
                    {stats.totalAttendance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;