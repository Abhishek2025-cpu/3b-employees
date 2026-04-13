import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MaterialEntries.css';

const MaterialEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterialEntries = async () => {
      setLoading(true);
      setError(null);

      const storedEmployeeId = localStorage.getItem("_id"); 
      const storedEmployeeName = localStorage.getItem("name");
      setEmployeeName(storedEmployeeName || "Unknown Mixture");

      if (!storedEmployeeId) {
        setError("Employee ID not found in local storage. Please log in.");
        setLoading(false);
        return;
      }

      const API_URL = `https://threebapi-1067354145699.asia-south1.run.app/api/mixture-tables/mixture/${storedEmployeeId}`;

      try {
        const res = await fetch(API_URL);
        const result = await res.json();

        if (!res.ok || !result.success) {
          setError(result.message || "Failed to fetch material entries.");
          setLoading(false);
          return;
        }

        const userEntries = (result.data || []).filter(
          entry => entry.mixtureId?._id === storedEmployeeId
        );

        if (userEntries.length === 0) {
          setError("No material entries found for this employee.");
          setLoading(false);
          return;
        }

        setEntries(userEntries);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialEntries();
  }, []);

  const ensureAMPMFormat = (time) => time || "N/A";
  const convertToHour = (timeStr) => parseInt(timeStr?.split('-')[0]?.split(':')[0] || '0', 10);

  const calculateSlotDuration = (timeSlot) => {
    if (!timeSlot || !timeSlot.includes('-')) return 0;
    let [start, end] = timeSlot.split('-');
    let startHour = parseInt(start.split(':')[0], 10);
    let endHour = parseInt(end.split(':')[0], 10);
    if (endHour < startHour) endHour += 24;
    return endHour - startHour;
  };

  const sortedEntries = [...entries].sort(
    (a, b) => convertToHour(a.time) - convertToHour(b.time)
  );

  const calculateTotals = () => {
    let totals = {
      backDana: 0, smoke: 0, grayHips: 0, eps: 0, h1: 0,
      yellowForm: 0, whiteForm: 0, zinc: 0, oil: 0, hours: 0
    };

    sortedEntries.forEach(entry => {
      totals.backDana += entry.backDana || 0;
      totals.smoke += entry.smoke || 0;
      totals.grayHips += entry.grayHips || 0;
      totals.eps += entry.eps || 0;
      totals.h1 += entry.h1 || 0;
      totals.yellowForm += entry.yellowForm || 0;
      totals.whiteForm += entry.whiteFormOptional || 0;
      totals.zinc += entry.zink || 0;
      totals.oil += entry.oil || 0;
      totals.hours += calculateSlotDuration(entry.time);
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="main-wrapper py-3">
      <div className="container-fluid">
        <div className="d-flex align-items-center mb-3">
  <button 
    className="btn btn-outline-secondary me-3"
    onClick={() => navigate(-1)}
  >
    ← Back
  </button>
</div>
        <h1 className="page-title text-center mb-4">Material Entries</h1>

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        
        {error && <div className="alert alert-danger mx-auto" style={{maxWidth: '600px'}}>{error}</div>}

        {!loading && !error && entries.length > 0 && (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0 custom-table">
                <thead>
                  <tr>
                    <th className="sticky-col-first">S.No.</th>
                    <th className="sticky-col-second">Item Name</th>
                    <th>Machine</th>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Time</th>
                    <th>Back Dana</th>
                    <th>Smoke</th>
                    <th>Gray Hips</th>
                    <th>EPS</th>
                    <th>H1</th>
                    <th>Yellow</th>
                    <th>White</th>
                    <th>Zinc</th>
                    <th>Oil</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEntries.map((entry, i) => (
                    <tr key={entry._id || i}>
                      <td className="sticky-col-first">{i + 1}</td>
                      <td className="sticky-col-second fw-bold">{entry.itemName}</td>
                      <td>{entry.machineNo}</td>
                      <td>{entry.date}</td>
                      <td>{entry.shift}</td>
                      <td>{ensureAMPMFormat(entry.time)}</td>
                      <td>{entry.backDana}</td>
                      <td>{entry.smoke}</td>
                      <td>{entry.grayHips}</td>
                      <td>{entry.eps}</td>
                      <td>{entry.h1}</td>
                      <td>{entry.yellowForm}</td>
                      <td>{entry.whiteFormOptional}</td>
                      <td>{entry.zink}</td>
                      <td>{entry.oil}</td>
                      <td className="time-stamp">{new Date(entry.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr className="fw-bold">
                    <td colSpan="6" className="text-end bg-light sticky-col-summary">Total:</td>
                    <td>{totals.backDana}</td>
                    <td>{totals.smoke}</td>
                    <td>{totals.grayHips}</td>
                    <td>{totals.eps}</td>
                    <td>{totals.h1}</td>
                    <td>{totals.yellowForm}</td>
                    <td>{totals.whiteForm}</td>
                    <td>{totals.zinc}</td>
                    <td>{totals.oil}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            {/* Mobile-Friendly Bottom Summary */}
            <div className="card-footer bg-white p-3 border-top-0">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="summary-box">
                  <span className="text-muted small d-block">Mixture Name</span>
                  <span className="fw-bold text-primary">{employeeName}</span>
                </div>
                <div className="summary-box text-md-end">
                  <span className="text-muted small d-block">Total Working Hours</span>
                  <span className="h5 mb-0 fw-bold">{totals.hours} <small>hrs</small></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialEntries;