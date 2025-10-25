import React, { useEffect, useState } from 'react';
import { getAssignmentsByEmployee } from '../api/allApi/getAsignMachine.js';
import AddAssignmentModal from './AddAssignmentModal/AddAssignmentModal.jsx'; // Make sure this path is correct

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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Pushes button to bottom
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
  cardButton: {
    backgroundColor: '#7853C2',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '15px', // Space from other content
    alignSelf: 'flex-end', // Align button to the right within the card
    transition: 'background-color 0.3s',
  },
  cardButtonHover: {
    backgroundColor: '#452983',
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
    zIndex: 1000, // Ensure it's above other content
  },
};

function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null); // State to hold data of assignment being edited

  // Function to fetch assignments
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
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAssignment(null); // Clear any editing data
    setShowModal(true);
  };

  const handleOpenEditModal = (assignment) => {
    // Transform assignment data to fit AddAssignmentModal's formData structure
    // This is crucial because your form expects modelNumber, machineNumber, etc.
    // while your assignment object has machine.name, mainItem.itemNo etc.
    const transformedData = {
      modelNumber: assignment.machine?.name || '', // Assuming machine name can be model number
      machineNumber: assignment.machine?.name || '', // Assuming machine name can be machine number
      date: new Date().toISOString().slice(0, 10), // Current date for edit, or fetch from assignment if available
      time: assignment.mainItem?.shift || '9 - 10 A.M', // Pre-fill with existing shift
      // These fields might not be directly available in your existing assignment structure
      // You'll need to decide how to map them or if they should remain empty for editing.
      frameLength: '',
      numberOfBox: '',
      boxWeight: '',
      frameWeight: '',
      description: '',
      // You might also want to pass the original assignment ID for update operations
      _id: assignment._id,
    };
    setEditingAssignment(transformedData);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingAssignment(null); // Clear editing data on close
  };

  const handleAssignmentSubmitted = async () => {
    // After an assignment is added or edited, re-fetch the list to update the UI
    await fetchAssignments();
    setShowModal(false); // Close the modal
    setEditingAssignment(null); // Clear editing data
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
        <p>No assignments found. Click "Add Assignment" to add one.</p>
      ) : (
        <div style={baseStyles.assignmentsGrid}>
          {assignments.map((a) => (
            <div key={a._id} style={baseStyles.assignmentCard}>
              <div> {/* Content wrapper for spacing */}
                <h2 style={baseStyles.cardHeader}>Machine: {a.machine?.name || 'N/A'}</h2>
                <p style={baseStyles.cardRow}><strong>Main Item:</strong> {a.mainItem?.itemNo || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>Operator:</strong> {a.mainItem?.operator?.name || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>Helper:</strong> {a.mainItem?.helper?.name || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>Shift:</strong> {a.mainItem?.shift || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>Company:</strong> {a.mainItem?.company || 'N/A'}</p>
              </div>
              <button
                style={baseStyles.cardButton}
                onClick={() => handleOpenEditModal(a)}
              >
                Edit Assignment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      {/* <button style={baseStyles.addButton} onClick={handleOpenAddModal}>
        + Add New Assignment
      </button> */}

      {/* The AddAssignmentModal component, now properly integrated */}
      <AddAssignmentModal
        show={showModal}
        onClose={handleModalClose}
        initialData={editingAssignment} // Pass data if editing
        onSubmitSuccess={handleAssignmentSubmitted}
      />
    </div>
  );
}

export default AssignmentsPage;