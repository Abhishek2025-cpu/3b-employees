import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAssignmentsByEmployee } from "../api/allApi/getAsignMachine.js";
import AddAssignmentModal from "./AddAssignmentModal/AddAssignmentModal.jsx";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal.jsx";
import Toast from "../Toast/Toast.jsx";
import { translations } from "../../src/AssignmentsPage/translations.js";

const baseStyles = {
  pageContainer: {
    padding: "20px",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    fontFamily: "'Roboto', sans-serif",
    position: "relative",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#452983",
    marginBottom: "25px",
  },
  assignmentsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },
  assignmentCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardHeader: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#7853C2",
    marginBottom: "15px",
  },
  cardRow: {
    fontSize: "1rem",
    color: "#333",
    marginBottom: "8px",
  },
  cardButtonContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
    gap: "10px",
  },
  cardButton: {
    backgroundColor: "#7853C2",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    flexGrow: 1,
    textAlign: "center",
  },
  markCompleteButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    flexGrow: 1,
    textAlign: "center",
  },
};

function AssignmentsPage() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentToComplete, setAssignmentToComplete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // ✅ LANGUAGE FROM LOCALSTORAGE
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  // ✅ Sync if changed in another tab/page
  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem("lang") || "en");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchAssignments = async () => {
    const storedId = localStorage.getItem("_id");
    const storedName = localStorage.getItem("name");

    if (!storedId) {
      setLoading(false);
      return;
    }

    setEmployeeId(storedId);
    setEmployeeName(storedName || "");

    try {
      const response = await getAssignmentsByEmployee(storedId, lang);
      const items = Array.isArray(response?.data) ? response.data : [];

      if (items.length > 0) {
        const firstItem = items[0];

        const itemNo =
          firstItem.itemNo?.trim() ||
          firstItem.product?.name?.trim() ||
          "Unknown";

        const machineNumber =
          firstItem.machineNumber?.toString().trim() || "N/A";

        localStorage.setItem("currentItemNo", itemNo);
        localStorage.setItem("currentMachineNo", machineNumber);
      }

      setAssignments(items);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchAssignments();
}, [lang]);

  const handleOpenEditModal = (assignment) => {
    const currentItemName =
      assignment.itemNo && assignment.itemNo !== "N/A"
        ? assignment.itemNo
        : assignment.product?.name || "";

    const currentMachineNumber =
      assignment.machineNumber && assignment.machineNumber !== "N/A"
        ? assignment.machineNumber
        : assignment.machine?.name || "";

    const currentItemId =
      assignment.itemId ||
      assignment.mainItemId ||
      assignment.product?._id ||
      assignment._id ||
      "";

    const currentMachineId =
      assignment.machineId || assignment.machine?._id || "";

    localStorage.setItem("currentItemNo", currentItemName);
    localStorage.setItem("currentMachineNo", currentMachineNumber);
    localStorage.setItem("currentItemId", currentItemId);
    localStorage.setItem("currentMachineId", currentMachineId);

    setEditingAssignment({
      _id: assignment._id,
      itemName: currentItemName,
      machineNumber: currentMachineNumber,
      mainItemId: currentItemId,
      machineId: currentMachineId,
      shift: assignment.shift || "",
      company: assignment.company || "",
      length: assignment.length || "",
      noOfSticks: assignment.noOfSticks || "",
      helperId: assignment.helpers?.[0]?._id || "",
      helperName: assignment.helpers?.[0]?.name || "",
      operatorId: assignment.operators?.[0]?._id || "",
      operatorName: assignment.operators?.[0]?.name || "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      time: "9-10",
    });

    setShowModal(true);
  };

  const handleMarkAsCompleteClick = (assignment) => {
    setAssignmentToComplete(assignment);
    setShowConfirmation(true);
  };

  const handleConfirmComplete = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    setShowConfirmation(false);
    setToastMessage("Assignment marked as complete!");
    setShowToast(true);

    fetchAssignments();
  };

  if (loading) return <p>Loading...</p>;

  if (!employeeId) return <p>No employee data found. Please login.</p>;

  return (
    <div style={baseStyles.pageContainer}>
      <h1 style={baseStyles.title}>
        {translations[lang]?.assignedTask} {employeeName || "Employee"}
      </h1>

      {assignments.length === 0 ? (
        <p>{translations[lang]?.noAssignments || "No assignments found."}</p>
      ) : (
        <div style={baseStyles.assignmentsGrid}>
          {assignments.map((assignment) => (
            <div key={assignment._id} style={baseStyles.assignmentCard}>
              <div>
                <h2 style={baseStyles.cardHeader}>
                  {translations[lang]?.itemNo}: {assignment.itemNo || "N/A"}
                </h2>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.operatorMachineNumber}:</strong>{" "}
                  {assignment.machineNumber || "N/A"}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.length}:</strong>{" "}
                  {assignment.length || "N/A"}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.noOfSticks}:</strong>{" "}
                  {assignment.noOfSticks || "N/A"}
                </p>

                <div style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.productDescription}:</strong>{" "}
                  Power Cut
                </div>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.mixture}:</strong>{" "}
                  {assignment.mixtures?.[0]?.name || "N/A"}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.operator}:</strong>{" "}
                  {assignment.operators?.[0]?.name || "N/A"}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.helper}:</strong>{" "}
                  {assignment.helpers?.[0]?.name || "N/A"}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.shift}:</strong>{" "}
                  {assignment.shift || "N/A"}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>{translations[lang]?.company}:</strong>{" "}
                  {assignment.company || "N/A"}
                </p>
              </div>

              <div style={baseStyles.cardButtonContainer}>
                <button
                  style={baseStyles.markCompleteButton}
                  onClick={() => handleMarkAsCompleteClick(assignment)}
                >
                  {translations[lang]?.markAsComplete}
                </button>

                <button
                  style={baseStyles.cardButton}
                  onClick={() => handleOpenEditModal(assignment)}
                >
                  {translations[lang]?.editAssignment}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddAssignmentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        initialData={editingAssignment}
        onSubmitSuccess={fetchAssignments}
        employeeId={employeeId}
      />

      <ConfirmationModal
        show={showConfirmation}
        message="Are you sure you want to mark this assignment as complete?"
        onConfirm={handleConfirmComplete}
        onCancel={() => setShowConfirmation(false)}
      />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default AssignmentsPage;