import React from "react";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    width: "400px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.4rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#452983",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
  },
  closeButton: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  saveButton: {
    backgroundColor: "#452983",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default function AddAssignmentModal({ show, onClose, onSave, form, onChange }) {
  if (!show) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <h2 style={modalStyles.title}>Add Assignment</h2>

        <input
          type="text"
          name="machineName"
          placeholder="Machine Name"
          value={form.machineName}
          onChange={onChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="employeeName"
          placeholder="Employee Name"
          value={form.employeeName}
          onChange={onChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="mainItemId"
          placeholder="Item Name"
          value={form.mainItemId}
          onChange={onChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="shift"
          placeholder="Shift"
          value={form.shift}
          onChange={onChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="operatorTable"
          placeholder="Operator Table"
          value={form.operatorTable}
          onChange={onChange}
          style={modalStyles.input}
        />

        <div>
          <button style={modalStyles.closeButton} onClick={onClose}>
            Cancel
          </button>
          <button style={modalStyles.saveButton} onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
