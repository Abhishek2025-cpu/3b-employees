import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ViewTask.css";
import { fetchAllMaterials } from "../../src/api/allApi/TaskController";

const ViewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Select Item");
  const [dropdownItems, setDropdownItems] = useState([]);
  const dropdownRef = useRef(null);
  const entriesPerPage = 12;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const getDropdownItems = async () => {
      const res = await fetchAllMaterials();
      if (res && res.success && Array.isArray(res.data)) {
        const items = res.data.map((item) => item.itemNo);
        setDropdownItems(items);
      }
    };

    const fetchTasks = async () => {
      try {
        const employeeId = localStorage.getItem("_id");
        if (!employeeId) return;
        const res = await axios.get(
          `https://threebapi-1067354145699.asia-south1.run.app/api/workers/employee-task/${employeeId}`
        );
        setTasks(res.data.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    getDropdownItems();
    fetchTasks();
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(tasks.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedTasks = tasks.slice(startIndex, startIndex + entriesPerPage);

  const parseWeight = (str) => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const totalBoxes = paginatedTasks.reduce(
    (sum, t) => sum + (parseFloat(t.numberOfBox) || 0),
    0
  );
  const totalBoxWeight = paginatedTasks.reduce(
    (sum, t) => sum + parseWeight(t.boxWeight),
    0
  );
  const totalFrameWeight = paginatedTasks.reduce(
    (sum, t) => sum + parseWeight(t.frameWeight),
    0
  );

  const formatTimeText = (timeData) => {
    if (!timeData) return "";
    const text = Array.isArray(timeData)
      ? timeData.join(", ")
      : String(timeData);
    return text.replace(/[\[\]"]/g, "");
  };

  const timeRangeToMinutes = (range) => {
    if (!range) return 0;
    const cleanRange = String(range).replace(/[\[\]"]/g, "");
    const [start, end] = cleanRange.split("-").map(Number);
    if (isNaN(start) || isNaN(end)) return 0;
    const durationHours = end - start;
    return durationHours > 0 ? durationHours * 60 : 0;
  };

  const totalWorkingMinutes = paginatedTasks.reduce((sum, task) => {
    if (!task.time || task.time.length === 0) return sum;
    const firstTime = Array.isArray(task.time) ? task.time[0] : task.time;
    const duration = timeRangeToMinutes(firstTime);
    return sum + duration;
  }, 0);

  const totalWorkingHours = `${Math.floor(totalWorkingMinutes / 60)}h ${
    totalWorkingMinutes % 60
  }m`;

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  return (
    <div className="view-task-page">
      {loading && (
        <div className="loader">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="content-wrapper">
          <div className="task-header">
            <h2 className="page-title">Ongoing Tasks</h2>
            <div className="custom-dropdown-container" ref={dropdownRef}>
              <div
                className={`custom-dropdown-btn ${isOpen ? "active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="btn-text">{selectedItem}</span>
                <span className="arrow-icon">▼</span>
              </div>
              {isOpen && (
                <ul className="custom-dropdown-menu">
                  {dropdownItems.length > 0 ? (
                    dropdownItems.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(item)}
                        className={selectedItem === item ? "selected" : ""}
                      >
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="no-data">No Materials Found</li>
                  )}
                </ul>
              )}
            </div>
          </div>

          <div className="table-container">
            <div className="table-wrapper">
              <table className="responsive-table">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Time</th>
                    <th>Frame Lengths</th>
                    <th>Boxes</th>
                    <th>Box Wt.</th>
                    <th>Frame Wt.</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task, index) => (
                    <tr key={task._id}>
                      <td data-label="S.No">{startIndex + index + 1}</td>
                      <td data-label="Time">
                        <span className="badge badge-time">
                          {formatTimeText(task.time)}
                        </span>
                      </td>
                      <td data-label="Frame Lengths">
                        <div className="badge-group">
                          {task.frameLength &&
                          Array.isArray(task.frameLength) ? (
                            task.frameLength.map((f, i) => (
                              <span key={i} className="badge badge-frame">
                                {f}
                              </span>
                            ))
                          ) : (
                            <span className="badge badge-frame">
                              {task.frameLength}
                            </span>
                          )}
                        </div>
                      </td>
                      <td data-label="Boxes">
                        <span className="badge badge-box">
                          {task.numberOfBox}
                        </span>
                      </td>
                      <td data-label="Box Wt.">
                        <span className="badge badge-weight ">
                          {task.boxWeight} Kg
                        </span>
                      </td>
                      <td data-label="Frame Wt.">
                        <span className="badge badge-frame-weight">
                          {task.frameWeight} Kg
                        </span>
                      </td>
                      <td data-label="Description" className="desc-col">
                        {task.description || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {paginatedTasks.length > 0 && (
                  <tfoot className="table-footer">
                    <tr className="summary-row">
                      <td className="footer-label" colSpan="3">
                        Total (This Page)
                      </td>
                      <td data-label="Total Boxes">{totalBoxes}</td>
                      <td data-label="Total Box Wt.">
                        {totalBoxWeight.toFixed(2)} kg
                      </td>
                      <td data-label="Total Frame Wt.">
                        {totalFrameWeight.toFixed(2)} kg
                      </td>
                      <td></td>
                    </tr>
                    <tr className="working-hours-row">
                      <td colSpan="7">
                        <div className="working-hours-content">
                          <span className="hours-label">
                            Total Working Hours:
                          </span>
                          <span className="hours-value">
                            {totalWorkingHours}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {tasks.length > entriesPerPage && (
              <div className="pagination">
                <button
                  className="pagination-btn prev-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <span className="btn-icon">◀</span>
                  <span className="btn-label">Prev</span>
                </button>
                <span className="pagination-info">
                  <span className="current-page">{currentPage}</span>
                  <span className="separator">/</span>
                  <span className="total-pages">{totalPages}</span>
                </span>
                <button
                  className="pagination-btn next-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <span className="btn-label">Next</span>
                  <span className="btn-icon">▶</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTask;
