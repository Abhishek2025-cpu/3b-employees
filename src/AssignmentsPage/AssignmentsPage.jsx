import React, { useEffect, useState } from 'react';
import { getAssignmentsByEmployee } from '../api/allApi/getAsignMachine.js';
import AddAssignmentModal from '../AssignmentsPage/AddAssignmentModal/AddAssignmentModal.jsx';

const baseStyles = {
  pageContainer: {
    padding: '20px',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    fontFamily: "'Roboto', sans-serif",
    position: 'relative',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#452983',
    marginBottom: '25px',
  },
  assignmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px',
  },
  assignmentCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
  },
  cardHeader: {
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#7853C2',
    marginBottom: '15px',
  },
  cardRow: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '8px',
  },
  addButton: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#452983',
    color: '#fff',
    border: 'none',
    padding: '15px 25px',
    borderRadius: '30px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    transition: 'all 0.3s',
  },
};

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Initialize form state with potential pre-fill values
  const [form, setForm] = useState({
    machineName: '',
    employeeName: '',
    mainItemId: '',
    operatorTable: '',
    itemName: '',  // new field
    shift: '',     // new field
  });


  const handleSave = async (formData) => {
  try {
    // Prepare data for API
    const payload = {
      machineId: formData.machineId,         // machine ID
      employeeIds: formData.employeeIds,     // array of employee IDs
      mainItemId: formData.mainItemId,       // main item ID
      shift: formData.shift,                 // shift
      operatorTable: JSON.stringify(formData.operatorTable || []), // stringify operator table
    };

    // Call the API
    const response = await axios.post(
      "https://threebtest.onrender.com/api/machines/assign-machine",
      payload
    );

    if (response.data.success) {
      alert("Assignment saved successfully!");
      setShowModal(false);

      // Update assignments locally
      setAssignments(prev => [...prev, response.data.data]);
    } else {
      alert("Failed: " + response.data.message);
    }
  } catch (err) {
    console.error("API Error:", err);
    alert("Server error while saving assignment.");
  }
};

  useEffect(() => {
    const fetchAssignments = async () => {
      const storedId = localStorage.getItem('employeeId');
      const storedName = localStorage.getItem('employeeName');

      if (!storedId) {
        setLoading(false);
        return;
      }

      setEmployeeId(storedId);
      setEmployeeName(storedName || '');

      try {
        const response = await getAssignmentsByEmployee(storedId);
        setAssignments(response || []);

   // In AssignmentsPage.jsx, inside useEffect where you fetch assignments:
        if (response && response.length > 0) {
          const firstAssignment = response[0];
          setForm(prevForm => ({
            ...prevForm,
            machineId: firstAssignment.machine?._id || '',
            employeeIds: [storedId],
            mainItemId: firstAssignment.mainItem?.itemNo || '',   // CHANGED: itemName -> mainItemId
            shift: firstAssignment.mainItem?.shift || '',
          }));
        }

      } catch (err) {
        console.error("Error fetching assignments:", err);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  

 const handleAddButtonClick = () => {
   
    setForm(prevForm => ({
    ...prevForm,
    employeeName: employeeName,
    machineName: assignments.length > 0 ? assignments[0].machine?.name || '' : '',
    mainItemId: assignments.length > 0 ? assignments[0].mainItem?.itemNo || '' : '', // CHANGED: itemName -> mainItemId
    shift: assignments.length > 0 ? assignments[0].mainItem?.shift || '' : '',
  }));

    setShowModal(true);
  };

  if (loading)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #452983',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '15px', fontWeight: 'bold', color: '#452983' }}>Fetching Assignments...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );

  if (!employeeId)
    return <p style={{ padding: '20px' }}>No employee data found. Please login.</p>;

  return (
    <div style={baseStyles.pageContainer}>
      <h1 style={baseStyles.title}>{`Assignments for ${employeeName || 'Employee'}`}</h1>

      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div style={baseStyles.assignmentsGrid}>
          {assignments.map((a) => (
            <div key={a._id} style={baseStyles.assignmentCard}>
              <h2 style={baseStyles.cardHeader}>Machine: {a.machine?.name || 'N/A'}</h2>
              <p style={baseStyles.cardRow}><strong>Main Item:</strong> {a.mainItem?.itemNo || 'N/A'}</p>
              <p style={baseStyles.cardRow}><strong>Operator:</strong> {a.mainItem?.operator?.name || 'N/A'}</p>
              <p style={baseStyles.cardRow}><strong>Helper:</strong> {a.mainItem?.helper?.name || 'N/A'}</p>
              <p style={baseStyles.cardRow}><strong>Shift:</strong> {a.mainItem?.shift || 'N/A'}</p>
              <p style={baseStyles.cardRow}><strong>Company:</strong> {a.mainItem?.company || 'N/A'}</p>
              <p style={baseStyles.cardRow}><strong>Item Name:</strong> {a.mainItem?.itemNo || 'N/A'}</p>
              <p style={baseStyles.cardRow}><strong>Shift:</strong> {a.mainItem?.shift || 'N/A'}</p>


            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button style={baseStyles.addButton} onClick={handleAddButtonClick}>
        + Add Assignment
      </button>

      {/* Modal Component */}
      <AddAssignmentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        form={form}
        onChange={handleChange}
      />
    </div>
  );
}

export default AssignmentsPage;