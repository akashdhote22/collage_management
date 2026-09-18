import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data.users || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, newRole) => {
    try {
      setMessage("");
      setError("");

      const response = await api.put(`/users/${userId}/role`, {
        role: newRole,
      });

      setMessage(response.data.message || "Role updated successfully");

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? { ...user, role: newRole }
            : user
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update role"
      );
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      setMessage("");
      setError("");

      const response = await api.delete(`/users/${userId}`);

      setMessage(response.data.message || "User deleted successfully");

      setUsers((previousUsers) =>
        previousUsers.filter((user) => user._id !== userId)
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="mt-4 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Manage Users
        </h1>
        <p className="text-gray-500">
          View, update roles and delete users.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border-b px-4 py-3">Name</th>
              <th className="border-b px-4 py-3">Email</th>
              <th className="border-b px-4 py-3">Role</th>
              <th className="border-b px-4 py-3">Created At</th>
              <th className="border-b px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-6 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border-b px-4 py-3">
                    {user.name}
                  </td>

                  <td className="border-b px-4 py-3">
                    {user.email}
                  </td>

                  <td className="border-b px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(event) =>
                        updateRole(user._id, event.target.value)
                      }
                      className="rounded-md border px-2 py-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </td>

                  <td className="border-b px-4 py-3">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="border-b px-4 py-3">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;