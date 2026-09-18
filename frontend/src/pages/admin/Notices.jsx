import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import api from "../../services/api";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAudience: "all",
    publishDate: "",
    expiryDate: "",
  });

  const fetchNotices = async () => {
    try {
      const response = await api.get("/notices");

      setNotices(response.data.notices || response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
      alert(error.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      targetAudience: "all",
      publishDate: "",
      expiryDate: "",
    });

    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const formatDateForInput = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toISOString().slice(0, 16);
  };

  const openEditModal = (notice) => {
    setEditingId(notice._id);

    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      targetAudience: notice.targetAudience || "all",
      publishDate: formatDateForInput(notice.publishDate),
      expiryDate: formatDateForInput(notice.expiryDate),
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        targetAudience: formData.targetAudience,
        publishDate: formData.publishDate
          ? new Date(formData.publishDate).toISOString()
          : undefined,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate).toISOString()
          : undefined,
      };

      if (editingId) {
        await api.put(`/notices/${editingId}`, payload);
        alert("Notice updated successfully");
      } else {
        await api.post("/notices", payload);
        alert("Notice added successfully");
      }

      closeModal();
      fetchNotices();
    } catch (error) {
      console.error("Error saving notice:", error);
      alert(error.response?.data?.message || "Failed to save notice");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/notices/${id}`);
      alert("Notice deleted successfully");
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert(error.response?.data?.message || "Failed to delete notice");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredNotices = notices.filter((notice) => {
    const searchText = searchTerm.toLowerCase();

    return (
      notice.title?.toLowerCase().includes(searchText) ||
      notice.description?.toLowerCase().includes(searchText) ||
      notice.targetAudience?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Notices Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage college notices
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Notice
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <Search size={20} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search by title, description or audience..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading notices...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No notices found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-800 text-sm text-white">
                <tr>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4">Audience</th>
                  <th className="px-4 py-4">Publish Date</th>
                  <th className="px-4 py-4">Expiry Date</th>
                  <th className="px-4 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredNotices.map((notice) => (
                  <tr
                    key={notice._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {notice.title}
                    </td>

                    <td className="max-w-xs px-4 py-4 text-sm text-slate-600">
                      <p className="line-clamp-2">
                        {notice.description}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700">
                        {notice.targetAudience}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(notice.publishDate)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {formatDate(notice.expiryDate)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(notice)}
                          className="rounded-lg bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(notice._id)}
                          className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                          title="Delete"
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Notice" : "Add Notice"}
              </h2>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Notice Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notice title"
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter notice description"
                  rows="5"
                  required
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Target Audience
                </label>

                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Publish Date
                  </label>

                  <input
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Expiry Date
                  </label>

                  <input
                    type="datetime-local"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>
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
                  {editingId ? "Update Notice" : "Add Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notices;