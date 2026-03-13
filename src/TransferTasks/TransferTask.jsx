import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TransferTasks.css";

const TransferTasks = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    mainItemId: "",
    fromEmployeeId: "",
    toEmployeeId: "",
    reason: "",
  });
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10; // Thoda sa clean dikhne ke liye 10 kiya hai

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await axios.get(
        "https://threebapi-1067354145699.asia-south1.run.app/api/task-transfers/transfers",
      );
      if (res.data.success) setTransfers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "https://threebapi-1067354145699.asia-south1.run.app/api/transferAssignedTask",
        form,
      );
      if (res.data.success) {
        setOpen(false);
        setForm({
          mainItemId: "",
          fromEmployeeId: "",
          toEmployeeId: "",
          reason: "",
        });
        fetchTransfers();
      } else alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to transfer task");
    }
  };

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = transfers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(transfers.length / perPage);

  return (
    <div className="transfer-container">
      {/* Header Section */}
      <div className="transfer-header-section">
        <div className="header-text">
          <h2>Transfer Tasks</h2>
          <p>Manage and track all task transfers efficiently</p>
        </div>
        {/* <button className="transfer-main-btn" onClick={() => setOpen(true)}>
          <span className="plus-icon">+</span> Transfer New Task
        </button> */}
      </div>

      {/* Modal */}
      {open && (
        <div className="transfer-modal-overlay">
          <div className="transfer-modal-card">
            <div className="modal-header">
  
              <button className="close-x" onClick={() => setOpen(false)}>
                &times;
              </button>
            </div>

            <div className="transfer-form-grid">
              {["mainItemId", "fromEmployeeId", "toEmployeeId"].map((field) => (
                <div key={field} className="form-group">
                  <label>
                    {field === "mainItemId"
                      ? "Main Item ID"
                      : field === "fromEmployeeId"
                        ? "From Employee ID"
                        : "To Employee ID"}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}

              <div className="form-group full-width">
                <label>Reason for Transfer</label>
                <textarea
                  rows="3"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Enter reason here..."
                />
              </div>
            </div>

            <div className="modal-footer-actions">
              <button className="btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-transfer-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item No</th>
                <th>Company</th>
                <th>Machine No</th>
                <th>From Employee</th>
                <th>To Employee</th>
                <th>Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length ? (
                currentData.map((t, i) => (
                  <tr
                    key={t._id}
                    className={i % 2 === 0 ? "row-light" : "row-dark"}
                  >
                    <td className="font-weight-bold">{indexOfFirst + i + 1}</td>
                    <td>
                      <span className="row-badge badge-id">
                        {t.mainItemId?.itemNo || "N/A"}
                      </span>
                    </td>
                    <td>{t.mainItemId?.company || "-"}</td>
                    <td>{t.mainItemId?.machineNumber || "-"}</td>
                    <td>
                      <span className="row-badge badge-emp-from">
                        {t.fromEmployee?.name || "Unknown"}
                      </span>
                    </td>
                    <td>
                      <span className="row-badge badge-emp-to">
                        {t.toEmployee?.name || "Unknown"}
                      </span>
                    </td>
                    <td className="reason-cell">{t.reason || "—"}</td>
                    <td className="date-cell">
                      {new Date(t.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data-msg">
                    No task transfers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Section */}
      {transfers.length > perPage && (
        <div className="modern-pagination">
          <div className="pagination-info">
            Showing <b>{indexOfFirst + 1}</b> to{" "}
            <b>{Math.min(indexOfLast, transfers.length)}</b> of{" "}
            <b>{transfers.length}</b> records
          </div>
          <div className="pagination-controls">
            <button
              className="pag-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="pag-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferTasks;
