import React, { useState, useEffect } from "react";
import axios from "axios";

const MixtureTaskdetails = () => {
  const [showModal, setShowModal] = useState(false);

  // ============================================================
  // ✅ 1. Employee (FROM Mixture) Reader
  // ============================================================
  const loggedMixtureId = localStorage.getItem("employeeId") || "";
  const loggedMixtureName = localStorage.getItem("employeeName") || "";
  const loggedMixtureRole = localStorage.getItem("employeeRole") || "";

  // ============================================================
  // ✅ 2. Read Main Item From Local Storage
  // ============================================================
// ✅ Use currentItemId from localStorage
const initialMixtureForm = JSON.parse(localStorage.getItem("initialMixtureForm")) || {};
const mainItemId = localStorage.getItem("currentItemId") || "";






  const mainItemName =
    initialMixtureForm?.productName ||
    initialMixtureForm?.mixtureName ||
    "No Main Item";

  // ============================================================
  // Mixtures Dropdown
  // ============================================================
  const [mixtures, setMixtures] = useState([]);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "https://threebapi-1067354145699.asia-south1.run.app/api/staff/get-employees"
      );

      if (Array.isArray(res.data)) {
        const mixtureOnly = res.data.filter((e) => e.role === "Mixture");
        setMixtures(mixtureOnly);
      }
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  // ============================================================
  // Transfer Logs
  // ============================================================
  const [transferLogs, setTransferLogs] = useState([]);

  const fetchTransfers = async () => {
    try {
      const res = await axios.get(
        "https://threebapi-1067354145699.asia-south1.run.app/api/mixture-tables/transfer/all"
      );

      if (res.data.success) {
        setTransferLogs(res.data.data);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchTransfers();
  }, []);

  // ============================================================
  // State: Transfer Form
  // ============================================================
  const [transferData, setTransferData] = useState({
    toMixtureId: "",
    reason: "",
  });

  const handleChange = (e) => {
    setTransferData({ ...transferData, [e.target.name]: e.target.value });
  };

  // ============================================================
  // Submit Transfer
  // ============================================================
const handleSubmit = async () => {
  try {
    const mainItemId = localStorage.getItem("currentItemId") || "";
    if (!mainItemId) {
      alert("❌ mainItemId missing!");
      return;
    }

    const payload = {
      mainItemId,
      fromMixtureId: loggedMixtureId,
      toMixtureId: transferData.toMixtureId,
      reason: transferData.reason,
    };

    console.log("FINAL PAYLOAD SENDING ---> ", payload);

    const res = await axios.post(
      "https://threebapi-1067354145699.asia-south1.run.app/api/mixture-tables/add",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("API RESPONSE:", res.data);

    if (res.data.success) {
      alert("Task transferred successfully!");
      setShowModal(false);
      fetchTransfers();
    } else {
      alert(res.data.message);
    }
  } catch (err) {
    console.error("Transfer error:", err);
    if (err.response?.status === 404) {
      alert("❌ API endpoint not found. Check URL.");
    } else {
      alert("Server error. Check console.");
    }
  }
};


  // ============================================================
  // UI RETURN
  // ============================================================
  return (
    <div className="transfer-container">
      {/* Header */}
      <div className="transfer-header">
        <h2>Task Transfer</h2>
        <button className="transfer-btn" onClick={() => setShowModal(true)}>
          ➕ Transfer Task
        </button>
      </div>

      {/* Logs Table */}
      <div className="table-wrapper">
        <table className="transfer-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Main Item</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Forms</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transferLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No transfer records found.
                </td>
              </tr>
            ) : (
              transferLogs.map((log, i) => (
                <tr key={log._id}>
                  <td>{i + 1}</td>

                  <td>
                    <span className="badge badge-blue">
                      {log.mainItemId?.itemNo}
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-gray">
                      {log.fromMixtureId?.name} ({log.fromMixtureId?.eid})
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-green">
                      {log.toMixtureId?.name} ({log.toMixtureId?.eid})
                    </span>
                  </td>

                  <td>{log.reason}</td>

                  <td>
                    <span className="badge badge-yellow">
                      {log.affectedFormIds?.length}
                    </span>
                  </td>

                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="transfer-modal">
          <div className="transfer-modal-content">
            <h3>Transfer Tasks</h3>

            <div className="transfer-form">
              {/* Main Item */}
              <div className="form-group">
                <label>Main Item</label>
                <input type="text" disabled value={mainItemName} />
              </div>

              {/* From Mixture */}
              <div className="form-group">
                <label>From Mixture</label>
                <input
                  disabled
                  value={
                    loggedMixtureName
                      ? `${loggedMixtureName} (${loggedMixtureRole})`
                      : "No mixture found"
                  }
                />
              </div>

              {/* To Mixture Dropdown */}
              <div className="form-group">
                <label>To Mixture</label>
                <select
                  name="toMixtureId"
                  value={transferData.toMixtureId}
                  onChange={handleChange}
                >
                  <option value="">Select Mixture</option>
                  {mixtures.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.eid})
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div className="form-group">
                <label>Reason</label>
                <input
                  type="text"
                  name="reason"
                  value={transferData.reason}
                  onChange={handleChange}
                  placeholder="Enter reason"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MixtureTaskdetails;
