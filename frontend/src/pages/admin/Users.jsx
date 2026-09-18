import { useEffect, useState } from "react";
import { Pencil, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");

      setUsers(response.data.users || response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const handleRoleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    try {
      await api.put(`/admin/users/${selectedUser._id}/role`, {
        role: selectedRole,
      });

      alert("User role updated successfully");
      closeModal();
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      alert(error.response?.data?.message || "Failed to update user role");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${id}`);

      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "teacher":
        return "bg-purple-100 text-purple-700";
      case "student":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchText = searchTerm.toLowerCase();

    return (
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          User Management
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage users and their access roles
        </p>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <Search size={20} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search by name, email or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-800 text-sm text-white">
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Created At</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {user.name}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openRoleModal(user)}
                          className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
                          title="Change Role"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(user._id)}
                          className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-slate-800">
                Change User Role
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRoleUpdate} className="space-y-4 p-5">
              <div>
                <p className="text-sm text-slate-500">User</p>
                <p className="font-semibold text-slate-800">
                  {selectedUser.name}
                </p>
                <p className="text-sm text-slate-600">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Select Role
                </label>

                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                  Update Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;