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
  const perPage = 12;

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const res = await axios.get(
        "https://threebapi-1067354145699.asia-south1.run.app/api/task-transfers/transfers"
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
        form
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
      {/* Header */}
      <div className="transfer-header">
        <h2>Transfer Tasks</h2>
        <button className="transfer-btn" onClick={() => setOpen(true)}>
         Transfer Task
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="transfer-modal">
          <div className="transfer-modal-content">
            <h3>Transfer Task</h3>

            <div className="transfer-form">
              {["mainItemId", "fromEmployeeId", "toEmployeeId"].map((field) => (
                <div key={field} className="form-group">
                  <label>
                    {field === "mainItemId"
                      ? "Main Item"
                      : field === "fromEmployeeId"
                      ? "From Employee"
                      : "To Employee"}
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

              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={(e) =>
                    setForm({ ...form, reason: e.target.value })
                  }
                  placeholder="Enter reason (optional)"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-wrapper">
        <table className="transfer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item No</th>
              <th>Company</th>
              <th>Machine No</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length ? (
              currentData.map((t, i) => (
                <tr key={t._id}>
                  <td>{indexOfFirst + i + 1}</td>
                  <td>
                    <span className="badge badge-gray">
                      {t.mainItemId?.itemNo}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-blue">
                      {t.mainItemId?.company}
                    </span>
                  </td>
                  <td>{t.mainItemId?.machineNumber || "-"}</td>
                  <td>
                    <span className="badge badge-green">
                      {t.fromEmployee?.name || "-"}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-yellow">
                      {t.toEmployee?.name || "-"}
                    </span>
                  </td>
                  <td>{t.reason || "—"}</td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No transfers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {transfers.length > perPage && (
        <div className="pagination">
          <span>
            Showing {indexOfFirst + 1} - {Math.min(indexOfLast, transfers.length)} of{" "}
            {transfers.length}
          </span>
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </button>
            <button
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
