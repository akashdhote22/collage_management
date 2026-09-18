import { useEffect, useState } from "react";
import api from "../../services/api";
import { BookOpen, LoaderCircle } from "lucide-react";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/teachers/courses");

      setCourses(response.data.courses || []);
    } catch (err) {
      console.error("Fetch teacher courses error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch courses"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Courses
        </h1>
        <p className="mt-1 text-gray-500">
          View the courses assigned to you.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <LoaderCircle className="mr-2 animate-spin" size={22} />
          Loading courses...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <BookOpen
            size={42}
            className="mx-auto mb-3 text-gray-400"
          />

          <h2 className="text-lg font-semibold text-gray-700">
            No courses assigned
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Courses assigned through the timetable will appear here.
          </p>
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course._id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                  <BookOpen size={24} />
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                  {course.courseCode}
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-800">
                {course.courseName}
              </h2>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {course.department}
                </p>

                <p>
                  <span className="font-semibold">Semester:</span>{" "}
                  {course.semester}
                </p>

                <p>
                  <span className="font-semibold">Credits:</span>{" "}
                  {course.credits}
                </p>
              </div>

              {course.description && (
                <p className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-500">
                  {course.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherCourses;