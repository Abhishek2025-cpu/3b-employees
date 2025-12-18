import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ViewTask.css";
// CHANGE 1: Controller ko import karein
import { fetchAllMaterials } from "../../src/api/allApi/TaskController";

const ViewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // --- DROPDOWN STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Select Item");

  // CHANGE 2: Dummy data ki jagah empty array state banayein
  const [dropdownItems, setDropdownItems] = useState([]);

  const dropdownRef = useRef(null);

  const entriesPerPage = 12;

  useEffect(() => {
    // Logic to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // CHANGE 3: Material Items (Dropdown) fetch karne ka function
    const getDropdownItems = async () => {
      const res = await fetchAllMaterials();
      if (res && res.success && Array.isArray(res.data)) {
        // Response data me se sirf 'itemNo' nikal kar list banayenge
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

    // Dono functions ko call karein
    getDropdownItems();
    fetchTasks();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(tasks.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedTasks = tasks.slice(startIndex, startIndex + entriesPerPage);

  // Helpers
  const parseWeight = (str) => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  const totalBoxes = paginatedTasks.reduce((sum, t) => sum + (parseFloat(t.numberOfBox) || 0), 0);
  const totalBoxWeight = paginatedTasks.reduce((sum, t) => sum + parseWeight(t.boxWeight), 0);
  const totalFrameWeight = paginatedTasks.reduce((sum, t) => sum + parseWeight(t.frameWeight), 0);

  // --- TIME FIX: Brackets aur Quotes hatane ke liye helper ---
  const formatTimeText = (timeData) => {
    if (!timeData) return "";
    // Agar data array hai to join karein, fir brackets aur quotes remove karein
    const text = Array.isArray(timeData) ? timeData.join(", ") : String(timeData);
    return text.replace(/[\[\]"]/g, ""); 
  };

  const timeRangeToMinutes = (range) => {
    if (!range) return 0;
    // Calculation se pehle string ko clean karein
    const cleanRange = String(range).replace(/[\[\]"]/g, "");
    const [start, end] = cleanRange.split("-").map(Number);
    if (isNaN(start) || isNaN(end)) return 0;
    const durationHours = end - start;
    return durationHours > 0 ? durationHours * 60 : 0;
  };

  const totalWorkingMinutes = paginatedTasks.reduce((sum, task) => {
    if (!task.time || task.time.length === 0) return sum;
    // Pehla time slot lekar calculate karein
    const firstTime = Array.isArray(task.time) ? task.time[0] : task.time;
    const duration = timeRangeToMinutes(firstTime);
    return sum + duration;
  }, 0);

  const totalWorkingHours = `${Math.floor(totalWorkingMinutes / 60)}h ${totalWorkingMinutes % 60}m`;

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
    console.log("Selected Item:", item);
  };

  return (
    <div className="view-task-page">
      {loading && (
        <div className="loader d-flex">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      )}

      {!loading && (
        <div className="table-container">

          {/* --- HEADER WITH ATTRACTIVE DROPDOWN --- */}
          <div className="task-header">
            <h2>Ongoing Tasks</h2>

            <div className="custom-dropdown-container" ref={dropdownRef}>
              <div
                className={`custom-dropdown-btn ${isOpen ? 'active' : ''}`}
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

          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fixed-col">S.No</th>
                <th className="time-col">Time</th>
                <th>Frame Lengths</th>
                <th>No. of Boxes</th>
                <th>Box Weight</th>
                <th>Frame Weight</th>
                <th className="desc-col">Description</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task, index) => (
                <tr key={task._id}>
                  <td className="fixed-col" data-label="S.No">
                    {startIndex + index + 1}
                  </td>
                  <td className="time-col" data-label="Time">
                    <span className="badge badge-time">
                      {/* FIX: Yahan brackets remove ho jayenge */}
                      {formatTimeText(task.time)}
                    </span>
                  </td>
                  <td data-label="Frame Lengths">
                    {task.frameLength && Array.isArray(task.frameLength) ? (
                      task.frameLength.map((f, i) => (
                        <span key={i} className="badge badge-frame">{f}</span>
                      ))
                    ) : (
                      <span className="badge badge-frame">{task.frameLength}</span>
                    )}
                  </td>
                  <td data-label="No. of Boxes">
                    <span className="badge badge-box">{task.numberOfBox}</span>
                  </td>
                  <td data-label="Box Weight">
                    <span className="badge badge-weight">{task.boxWeight + "Kg"}</span>
                  </td>
                  <td data-label="Frame Weight">
                    <span className="badge badge-frame-weight">{task.frameWeight + "Kg"}</span>
                  </td>
                  <td className="desc-col" data-label="Description">
                    {task.description || "N/A"}
                  </td>
                </tr>
              ))}

              {paginatedTasks.length === 0 && (
                <tr><td colSpan="7" style={{textAlign: "center"}}>No ongoing tasks available.</td></tr>
              )}
            </tbody>

            {paginatedTasks.length > 0 && (
              <tfoot>
                <tr className="summary-row">
                  <td colSpan="3">Total (This Page)</td>
                  <td>{totalBoxes}</td>
                  <td>{totalBoxWeight} kg</td>
                  <td>{totalFrameWeight} kg</td>
                  <td></td>
                </tr>
                <tr className="summary-row">
                  <td colSpan="7">Total Working Hours: {totalWorkingHours}</td>
                </tr>
              </tfoot>
            )}
          </table>

          {tasks.length > entriesPerPage && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                ◀ Prev
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                Next ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewTask;