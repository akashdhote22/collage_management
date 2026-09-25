import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  IndianRupee,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import api from "../../services/api";

const initialForm = {
  studentId: "",
  academicYear: "",
  semester: "",
  totalAmount: "",
  paidAmount: "",
  paymentDate: "",
  remarks: "",
};

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFeeId, setSelectedFeeId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fees");

      const data =
        response.data.fees ||
        response.data.data ||
        response.data ||
        [];

      setFees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch fees error:", err);

      setError(
        err.response?.data?.message || "Failed to fetch fees"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");

      const data =
        response.data.students ||
        response.data.data ||
        response.data ||
        [];

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch students error:", err);
    }
  };

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const getStudentName = (student) => {
    if (!student) return "Unknown Student";

    return (
      student.userId?.name ||
      student.name ||
      "Unknown Student"
    );
  };

  const getStudentEmail = (student) => {
    if (!student) return "";

    return student.userId?.email || student.email || "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFeeId(null);
    setFormData(initialForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (fee) => {
    setIsEditMode(true);
    setSelectedFeeId(fee._id);

    const studentId =
      fee.studentId?._id ||
      fee.studentId ||
      "";

    const formattedPaymentDate = fee.paymentDate
      ? new Date(fee.paymentDate).toISOString().split("T")[0]
      : "";

    setFormData({
      studentId,
      academicYear: fee.academicYear || "",
      semester: fee.semester || "",
      totalAmount: fee.totalAmount ?? "",
      paidAmount: fee.paidAmount ?? "",
      paymentDate: formattedPaymentDate,
      remarks: fee.remarks || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    setIsEditMode(false);
    setSelectedFeeId(null);
    setFormData(initialForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAmount = Number(formData.totalAmount);
    const paidAmount = Number(formData.paidAmount);

    if (paidAmount > totalAmount) {
      setError(
        "Paid amount cannot be greater than total amount."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const pendingAmount = totalAmount - paidAmount;

      let paymentStatus = "pending";

      if (paidAmount === totalAmount && totalAmount > 0) {
        paymentStatus = "paid";
      } else if (
        paidAmount > 0 &&
        paidAmount < totalAmount
      ) {
        paymentStatus = "partial";
      }

      const payload = {
        studentId: formData.studentId,
        academicYear: formData.academicYear,
        semester: Number(formData.semester),
        totalAmount,
        paidAmount,
        pendingAmount,
        paymentStatus,
        paymentDate: formData.paymentDate || null,
        remarks: formData.remarks,
      };

      if (isEditMode) {
        await api.put(
          `/fees/${selectedFeeId}`,
          payload
        );
      } else {
        await api.post("/fees", payload);
      }

      closeModal();
      fetchFees();
    } catch (err) {
      console.error("Save fee error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save fee record"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (feeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this fee record?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/fees/${feeId}`);
      fetchFees();
    } catch (err) {
      console.error("Delete fee error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete fee record"
      );
    }
  };

  const filteredFees = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return fees.filter((fee) => {
      const studentName =
        getStudentName(fee.studentId).toLowerCase();

      const studentEmail =
        getStudentEmail(fee.studentId).toLowerCase();

      const academicYear =
        fee.academicYear?.toLowerCase() || "";

      const paymentStatus =
        fee.paymentStatus?.toLowerCase() || "";

      return (
        studentName.includes(search) ||
        studentEmail.includes(search) ||
        academicYear.includes(search) ||
        paymentStatus.includes(search) ||
        String(fee.semester).includes(search)
      );
    });
  }, [fees, searchTerm]);

  const totalFees = fees.reduce(
    (sum, fee) => sum + Number(fee.totalAmount || 0),
    0
  );

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const totalPending = fees.reduce(
    (sum, fee) => sum + Number(fee.pendingAmount || 0),
    0
  );

  const paidRecords = fees.filter(
    (fee) => fee.paymentStatus === "paid"
  ).length;

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      {/* Hero Header */}
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 p-5 text-white shadow-lg md:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-200">
              <CircleDollarSign size={18} />
              Finance Management
            </div>

            <h1 className="text-2xl font-bold md:text-3xl">
              Fees Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
              Manage student fee records, payments,
              pending amounts and payment status from one
              place.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-900 shadow-md transition hover:bg-blue-50 active:scale-[0.98]"
          >
            <Plus size={19} />
            Add Fee Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Fee
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                ₹{formatAmount(totalFees)}
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <IndianRupee size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Paid
              </p>
              <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                ₹{formatAmount(totalPaid)}
              </h2>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Pending
              </p>
              <h2 className="mt-2 text-2xl font-bold text-red-600">
                ₹{formatAmount(totalPending)}
              </h2>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <Clock3 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Paid Records
              </p>
              <h2 className="mt-2 text-2xl font-bold text-indigo-600">
                {paidRecords}
              </h2>
            </div>

            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <CreditCard size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-bold text-slate-800">
              Fee Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredFees.length} of {fees.length} records
            </p>
          </div>

          <div className="relative w-full lg:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student, year, status..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>

          <button
            onClick={fetchFees}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Student
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Academic Year
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Semester
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Total
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Paid
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Pending
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-14 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading fee records...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-14 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
                        <CircleDollarSign size={28} />
                      </div>

                      <p className="mt-3 font-semibold text-slate-700">
                        No fee records found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try another search or add a new fee record.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFees.map((fee) => (
                  <tr
                    key={fee._id}
                    className="border-b border-slate-100 transition hover:bg-blue-50/40"
                  >
                    {/* Student */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                          {getStudentName(fee.studentId)
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {getStudentName(fee.studentId)}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {getStudentEmail(fee.studentId) ||
                              "No email available"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Academic Year */}
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                        {fee.academicYear || "-"}
                      </span>
                    </td>

                    {/* Semester */}
                    <td className="px-5 py-4 text-sm font-medium text-slate-600">
                      Semester {fee.semester}
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-800">
                        ₹{formatAmount(fee.totalAmount)}
                      </span>
                    </td>

                    {/* Paid */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-emerald-600">
                        ₹{formatAmount(fee.paidAmount)}
                      </span>
                    </td>

                    {/* Pending */}
                    <td className="px-5 py-4">
                      <span
                        className={`font-bold ${
                          Number(fee.pendingAmount) > 0
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        ₹{formatAmount(fee.pendingAmount)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${
                          fee.paymentStatus === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : fee.paymentStatus === "partial"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {fee.paymentStatus === "paid" ? (
                          <CheckCircle2 size={14} />
                        ) : fee.paymentStatus === "partial" ? (
                          <Clock3 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {fee.paymentStatus || "pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(fee)}
                          className="rounded-xl border border-blue-100 bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                          title="Edit fee"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(fee._id)
                          }
                          className="rounded-xl border border-red-100 bg-red-50 p-2.5 text-red-600 transition hover:bg-red-600 hover:text-white"
                          title="Delete fee"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[95vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-6">
              <div>
                <div className="flex items-center gap-2 text-blue-600">
                  <CircleDollarSign size={19} />

                  <span className="text-xs font-bold uppercase tracking-wide">
                    Fee Management
                  </span>
                </div>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {isEditMode
                    ? "Edit Fee Record"
                    : "Add Fee Record"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter student fee and payment details.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-5 md:p-6"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Student */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRound size={16} />
                    Student
                  </label>

                  <select
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                    disabled={isEditMode}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="">
                      Select student
                    </option>

                    {students.map((student) => (
                      <option
                        key={student._id}
                        value={student._id}
                      >
                        {getStudentName(student)}
                        {student.rollNumber
                          ? ` - ${student.rollNumber}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Year */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Academic Year
                  </label>

                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleChange}
                    placeholder="e.g. 2026-27"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Semester */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Semester
                  </label>

                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  >
                    <option value="">
                      Select semester
                    </option>

                    {[1, 2, 3, 4, 5, 6, 7, 8].map(
                      (semester) => (
                        <option
                          key={semester}
                          value={semester}
                        >
                          Semester {semester}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Total Amount */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <IndianRupee size={16} />
                    Total Amount
                  </label>

                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Paid Amount
                  </label>

                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    placeholder="e.g. 25000"
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Payment Date */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} />
                    Payment Date
                  </label>

                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Live Pending */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Pending Amount
                  </label>

                  <div className="flex min-h-[46px] items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-red-600">
                    ₹
                    {formatAmount(
                      Math.max(
                        0,
                        Number(formData.totalAmount || 0) -
                          Number(formData.paidAmount || 0)
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Remarks
                </label>

                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter remarks..."
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Saving..."
                    : isEditMode
                    ? "Update Fee"
                    : "Add Fee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fees;