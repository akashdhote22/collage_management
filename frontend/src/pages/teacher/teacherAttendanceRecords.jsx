import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  ClipboardList,
  LoaderCircle,
  Search,
  CalendarDays,
  CheckCircle,
  XCircle,
} from "lucide-react";

const TeacherAttendanceRecords = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance");

      setAttendances(response.data.attendances || []);
    } catch (err) {
      console.error("Fetch attendance records error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load attendance records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const getStudentName = (attendance) => {
    return (
      attendance.studentId?.userId?.name ||
      attendance.studentId?.name ||
      "Unknown Student"
    );
  };

  const getCourseName = (attendance) => {
    const course = attendance.courseId;

    if (!course) {
      return "Unknown Course";
    }

    return `${course.courseCode || ""} ${
      course.courseName || ""
    }`.trim();
  };

  const filteredAttendances = attendances.filter((attendance) => {
    const studentName = getStudentName(attendance).toLowerCase();
    const courseName = getCourseName(attendance).toLowerCase();

    const matchesSearch =
      studentName.includes(searchTerm.toLowerCase()) ||
      courseName.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      attendance.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        <LoaderCircle
          className="mr-2 animate-spin"
          size={22}
        />
        Loading attendance records...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Attendance Records
        </h1>
        <p className="mt-1 text-gray-500">
          View attendance records of students and courses.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by student or course..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Records
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-800">
            {filteredAttendances.length}
          </h2>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-700">
            Present Records
          </p>
          <h2 className="mt-1 text-2xl font-bold text-green-700">
            {
              filteredAttendances.filter(
                (attendance) =>
                  attendance.status === "present"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            Absent Records
          </p>
          <h2 className="mt-1 text-2xl font-bold text-red-700">
            {
              filteredAttendances.filter(
                (attendance) =>
                  attendance.status === "absent"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Records Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center border-b border-gray-200 p-5">
          <ClipboardList
            size={22}
            className="mr-2 text-blue-600"
          />
          <h2 className="text-lg font-bold text-gray-800">
            Attendance List
          </h2>
        </div>

        {filteredAttendances.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No attendance records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Course
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredAttendances.map((attendance) => (
                  <tr
                    key={attendance._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {getStudentName(attendance)}
                      </p>

                      {attendance.studentId?.rollNumber && (
                        <p className="text-xs text-gray-500">
                          Roll No:{" "}
                          {attendance.studentId.rollNumber}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-700">
                      {getCourseName(attendance)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center text-gray-600">
                        <CalendarDays
                          size={16}
                          className="mr-2"
                        />
                        {formatDate(attendance.date)}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {attendance.status === "present" ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                          <CheckCircle
                            size={15}
                            className="mr-1"
                          />
                          Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                          <XCircle
                            size={15}
                            className="mr-1"
                          />
                          Absent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendanceRecords;