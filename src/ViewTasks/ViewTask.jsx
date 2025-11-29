import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewTask.css";

const ViewTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 12;

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const employeeId = localStorage.getItem("_id"); 

      if (!employeeId) {
        console.error("Employee ID not found");
        return;
      }

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

  fetchTasks();
}, []);


  // Pagination logic
  const totalPages = Math.ceil(tasks.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedTasks = tasks.slice(startIndex, startIndex + entriesPerPage);

  // Helper: extract numeric weight from strings like "20kg"
  const parseWeight = (str) => {
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  // Summary calculations for current page
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


  // Convert "9-10" → minutes
const timeRangeToMinutes = (range) => {
  if (!range) return 0;

  const [start, end] = range.split("-").map(Number);

  if (isNaN(start) || isNaN(end)) return 0;

  const durationHours = end - start;
  return durationHours > 0 ? durationHours * 60 : 0;
};
  // Convert "HH:MM AM/PM" → minutes
const timeToMinutes = (t) => {
  if (!t) return 0;
  const [time, modifier] = t.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Calculate total working hours for current page
const totalWorkingMinutes = paginatedTasks.reduce((sum, task) => {
  if (!task.time || task.time.length === 0) return sum;

  // Assuming first element: "9-10"
  const duration = timeRangeToMinutes(task.time[0]);
  return sum + duration;
}, 0);

const totalWorkingHours = `${Math.floor(totalWorkingMinutes / 60)}h ${
  totalWorkingMinutes % 60
}m`;






  return (
    <div className="view-task-page">
      {loading && (
        <div className="loader d-flex">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      )}

      {!loading && (
        <div className="table-container">
          <h2>Ongoing Tasks</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fixed-col">S.No</th>
                <th className="time-col">Time</th>
                <th>Frame Lengths</th>
                <th>No. of Boxes</th>
                <th>Box Weight</th>
                <th>Frame Weight</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.map((task, index) => (
                <tr key={task._id}>
                  <td className="fixed-col">{startIndex + index + 1}</td>
                  <td className="time-col">
                    <span className="badge badge-time">
                      {task.time?.join(", ")}
                    </span>
                  </td>
                  <td>
                    {task.frameLength.map((f, i) => (
                      <span key={i} className="badge badge-frame">
                        {f}
                      </span>
                    ))}
                  </td>
                  <td>
                    <span className="badge badge-box">{task.numberOfBox}</span>
                  </td>
                  <td>
                    <span className="badge badge-weight">{task.boxWeight+"Kg"}</span>
                  </td>
                  <td>
                    <span className="badge badge-frame-weight">
                      {task.frameWeight+"Kg"}
                    </span>
                  </td>
                </tr>
              ))}

              {paginatedTasks.length === 0 && (
                <tr>
                  <td colSpan="6">No ongoing tasks available.</td>
                </tr>
              )}
            </tbody>

            {paginatedTasks.length > 0 && (
              <tfoot>
  <tr className="summary-row">
    <td colSpan="3">Total (This Page)</td>
    <td>{totalBoxes}</td>
    <td>{totalBoxWeight} kg</td>
    <td>{totalFrameWeight} kg</td>
  </tr>

  <tr className="summary-row">
    <td colSpan="6">Total Working Hours: {totalWorkingHours}</td>
  </tr>
</tfoot>

            )}
          </table>

          {/* Pagination Controls */}
          {tasks.length > entriesPerPage && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                ◀ Prev
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
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
