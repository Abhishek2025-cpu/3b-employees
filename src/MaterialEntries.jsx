import React, { useState, useEffect } from 'react';
import './MaterialEntries.css';

const MaterialEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    const fetchMaterialEntries = async () => {
      setLoading(true);
      setError(null);

      const storedEmployeeId = localStorage.getItem("_id"); // mixtureId
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
    let totalBackDana = 0,
      totalSmoke = 0,
      totalGrayHips = 0,
      totalEps = 0,
      totalH1 = 0,
      totalYellowForm = 0,
      totalWhiteForm = 0,
      totalZinc = 0,
      totalOil = 0,
      totalWorkingHours = 0;

    sortedEntries.forEach(entry => {
      totalBackDana += entry.backDana || 0;
      totalSmoke += entry.smoke || 0;
      totalGrayHips += entry.grayHips || 0;
      totalEps += entry.eps || 0;
      totalH1 += entry.h1 || 0;
      totalYellowForm += entry.yellowForm || 0;
      totalWhiteForm += entry.whiteFormOptional || 0;
      totalZinc += entry.zink || 0;
      totalOil += entry.oil || 0;
      totalWorkingHours += calculateSlotDuration(entry.time);
    });

    return { totalBackDana, totalSmoke, totalGrayHips, totalEps, totalH1, totalYellowForm, totalWhiteForm, totalZinc, totalOil, totalWorkingHours };
  };

  const { totalBackDana, totalSmoke, totalGrayHips, totalEps, totalH1, totalYellowForm, totalWhiteForm, totalZinc, totalOil, totalWorkingHours } = calculateTotals();

  return (
    <div className="container mt-4">
      <h1 className="text-center">Material Entries</h1>

      {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {!loading && !error && entries.length > 0 && (
        <div className="table-container">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>S. No.</th>
                <th>Item Name</th>
                <th>Machine No</th>
                <th>Date</th>
                <th>Shift</th>
                <th>Time</th>
                <th>Back Dana</th>
                <th>Smoke</th>
                <th>Gray Hips</th>
                <th>EPS</th>
                <th>H1</th>
                <th>Yellow Form</th>
                <th>White Form</th>
                <th>Zinc</th>
                <th>Oil</th>
                <th>Submit Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedEntries.map((entry, i) => (
                <tr key={entry._id || i}>
                  <td>{i + 1}</td>
                  <td>{entry.itemName}</td>
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
                  <td>{new Date(entry.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="6"><strong>Total</strong></td>
                <td>{totalBackDana}</td>
                <td>{totalSmoke}</td>
                <td>{totalGrayHips}</td>
                <td>{totalEps}</td>
                <td>{totalH1}</td>
                <td>{totalYellowForm}</td>
                <td>{totalWhiteForm}</td>
                <td>{totalZinc}</td>
                <td>{totalOil}</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="15" style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Working Hours: {totalWorkingHours} hrs</td>
                <td></td>
              </tr>
              <tr>
                <td colSpan="16" style={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#e6f4ec' }}>
                  Mixture: {employeeName}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaterialEntries;
