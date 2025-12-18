import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getAssignmentsByEmployee } from '../api/allApi/getAsignMachine.js';
import AddAssignmentModal from './AddAssignmentModal/AddAssignmentModal.jsx';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal.jsx'; // New Component
import Toast from '../Toast/Toast.jsx'; // New Component

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
    justifyContent: 'space-between',
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
  cardButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Aligns buttons to left and right
    marginTop: '15px',
    gap: '10px', // Space between buttons
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
    transition: 'background-color 0.3s',
    flexGrow: 1, // Allows buttons to grow and fill space
    textAlign: 'center',
  },
  markCompleteButton: {
    backgroundColor: '#28a745', // Green for complete
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    flexGrow: 1,
    textAlign: 'center',
  },
  cardButtonHover: {
    backgroundColor: '#452983',
  },
  markCompleteButtonHover: {
    backgroundColor: '#218838',
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
    zIndex: 1000,
  },
};

function AssignmentsPage() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showModal, setShowModal] = useState(false); // For AddAssignmentModal (Operator)
  const [editingAssignment, setEditingAssignment] = useState(null); // For AddAssignmentModal (Operator)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [assignmentToComplete, setAssignmentToComplete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchAssignments = async () => {
    const storedId = localStorage.getItem('_id');
    const storedName = localStorage.getItem('name');

    if (!storedId) {
      setLoading(false);
      return;
    }

    setEmployeeId(storedId);
    setEmployeeName(storedName || '');

    try {
      const response = await getAssignmentsByEmployee(storedId);

      console.log("Assignments API response:", response);

      // response itself is the array
      const items = Array.isArray(response) ? response : [];

      if (items.length > 0) {
        const firstItem = items[0];

        // Extract values
        const itemNo =
          firstItem.itemNo?.trim() ||
          firstItem.product?.name?.trim() ||
          "Unknown";

        const machineNumber =
          firstItem.machineNumber?.toString().trim() || "N/A";

        // SAVE TO LOCAL STORAGE
        localStorage.setItem("currentItemNo", itemNo);
        localStorage.setItem("currentMachineNo", machineNumber);

        console.log("Saved Item No:", itemNo);
        console.log("Saved Machine No:", machineNumber);

      } else {
        console.warn("No items found to store itemNo or machineNumber.");
      }

      setAssignments(items);

    } catch (error) {
      console.error("Error fetching assignments:", error);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };




  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenAddModal = () => {
    setEditingAssignment(null);
    setShowModal(true);
  };

  // AssignmentsPage.js ke andar ye function update karein

  const handleOpenEditModal = (assignment) => {
    console.log("🛠 Checking Assignment Data on Click:", assignment);

    // 1. Value nikalna (Strictly check karein)
    // Pehle 'itemNo' check karein, agar wo nahi hai tab 'product.name' lein
    const currentItemName =
      (assignment.itemNo && assignment.itemNo !== 'N/A') ? assignment.itemNo :
        (assignment.product?.name) ? assignment.product.name :
          '';

    // Machine Number logic
    const currentMachineNumber =
      (assignment.machineNumber && assignment.machineNumber !== 'N/A') ? assignment.machineNumber :
        (assignment.machine?.name) ? assignment.machine.name :
          '';

    // IDs nikalna
    const currentItemId = assignment.itemId || assignment.mainItemId || assignment.product?._id || assignment._id || '';
    const currentMachineId = assignment.machineId || assignment.machine?._id || '';

    console.log("👉 Extracted Values:", { currentItemName, currentMachineNumber });

    // 2. LOCAL STORAGE UPDATE (Zaruri hai)
    localStorage.setItem("currentItemNo", currentItemName);
    localStorage.setItem("currentMachineNo", currentMachineNumber);
    localStorage.setItem("currentItemId", currentItemId);
    localStorage.setItem("currentMachineId", currentMachineId);

    // 3. Modal ke liye data taiyar karna
    const transformedData = {
      _id: assignment._id,
      itemName: currentItemName,       // Yahi value modal me jayegi
      machineNumber: currentMachineNumber, // Yahi value modal me jayegi

      mainItemId: currentItemId,
      machineId: currentMachineId,

      shift: assignment.shift || '',
      company: assignment.company || '',
      length: assignment.length || '',
      noOfSticks: assignment.noOfSticks || '',
      helperId: assignment.helpers?.[0]?._id || '',
      helperName: assignment.helpers?.[0]?.name || '',
      operatorId: assignment.operators?.[0]?._id || '',
      operatorName: assignment.operators?.[0]?.name || '',
      description: assignment.product?.description || '',
      date: new Date().toISOString().slice(0, 10),
      time: '9-10',
      frameLength: '',
      numberOfBox: '',
      boxWeight: '',
      frameWeight: '',
    };

    setEditingAssignment(transformedData);
    setShowModal(true);
  };

  const handleOpenMixtureEditModal = (assignment) => {
    console.log("🧾 Raw assignment for Mixture Form:", assignment);

    // Determine itemId safely
    const itemId =
      assignment?.itemId ||                  // Direct itemId
      assignment?.mainItemId ||              // Fallback if mainItemId exists
      assignment?.product?._id ||            // If assignment.product exists
      assignment?._id ||                     // Last fallback
      '';                                    // Empty string if none found

    const mixtureId =
      assignment?.mixtures?.[0]?._id || ''; // First mixture id if available

    const initialFormDataForMixture = {
      productName: assignment?.product?.name || 'N/A',
      mixtureName: assignment?.mixtures?.[0]?.name || 'N/A',
      machineNo: assignment?.mixtureMachine || 'N/A',
      itemId,        // Correctly mapped itemId
      mixtureId,     // Correctly mapped mixtureId
      date: new Date().toISOString().slice(0, 10),
      shift: assignment?.shift || 'Day',
      time: '9:00-10:00',
    };

    console.log("✅ Initial data for MixtureForm:", initialFormDataForMixture);

    // Save to localStorage so MixtureForm can access it
    localStorage.setItem('initialMixtureForm', JSON.stringify(initialFormDataForMixture));
    localStorage.setItem('currentItemId', itemId); // Also store separately if needed

    // Navigate to the MixtureForm page
    navigate('/mixture-form');
  };



  const handleModalClose = () => {
    setShowModal(false);
    setEditingAssignment(null);
  };

  const handleAssignmentSubmitted = async () => {
    await fetchAssignments();
    setShowModal(false);
    setEditingAssignment(null);
  };

  const handleMarkAsCompleteClick = (assignment) => {
    setAssignmentToComplete(assignment);
    setShowConfirmation(true);
  };

  const handleConfirmComplete = async () => {
    console.log(`Marking assignment ${assignmentToComplete._id} as complete.`);

    // Simulate API call success
    await new Promise(resolve => setTimeout(resolve, 500));

    setShowConfirmation(false);
    setAssignmentToComplete(null);
    setToastMessage('Assignment marked as complete!');
    setToastType('success');
    setShowToast(true);

    fetchAssignments();
  };

  const handleCancelComplete = () => {
    setShowConfirmation(false);
    setAssignmentToComplete(null);
  };

  const handleCloseToast = () => {
    setShowToast(false);
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
          {assignments.map((assignment) => (
            <div key={assignment._id} style={baseStyles.assignmentCard}>
              <div>
                <h2 style={baseStyles.cardHeader}>Item No: {assignment.itemNo || 'N/A'}</h2>
                {/* <p style={baseStyles.cardRow}><strong>Mixture Machine Number:</strong> {assignment.mixtureMachine || 'N/A'}</p> */}
                <p style={baseStyles.cardRow}><strong>Operator Machine Number:</strong> {assignment.machineNumber || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>Length:</strong> {assignment.length || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>No. of Sticks:</strong> {assignment.noOfSticks || 'N/A'}</p>

                {assignment.product && (
                  <div style={baseStyles.cardRow}>
                    <strong>Product Description:</strong>
                    {assignment.product?.description ?? 'N/A'}
                  </div>
                )}



                <p style={baseStyles.cardRow}>
                  <strong>Mixture:</strong> {assignment.mixtures && assignment.mixtures.length > 0
                    ? assignment.mixtures[0].name
                    : 'N/A'}
                </p>

                <p style={baseStyles.cardRow}>
                  <strong>Operator:</strong> {assignment.operators && assignment.operators.length > 0
                    ? assignment.operators[0].name
                    : 'N/A'}
                </p>
                <p style={baseStyles.cardRow}>
                  <strong>Helper:</strong> {assignment.helpers && assignment.helpers.length > 0
                    ? assignment.helpers[0].name
                    : 'N/A'}
                </p>
                <p style={baseStyles.cardRow}><strong>Shift:</strong> {assignment.shift || 'N/A'}</p>
                <p style={baseStyles.cardRow}><strong>Company:</strong> {assignment.company || 'N/A'}</p>
              </div>
              <div style={baseStyles.cardButtonContainer}>
                <button
                  style={baseStyles.markCompleteButton}
                  onClick={() => handleMarkAsCompleteClick(assignment)}
                >
                  Mark as Complete
                </button>
                <button
                  style={baseStyles.cardButton}
                  onClick={() => {
                    const role = localStorage.getItem("role");
                    console.log("User Role from LocalStorage:", role);

                    if (role === "Operator" || role === 'Helper') {
                      console.log("Calling handleOpenEditModal() for Operator");
                      handleOpenEditModal(assignment);
                    }
                    else if (role === "Mixture") {
                      console.log("Calling handleOpenMixtureEditModal() for Mixture");
                      handleOpenMixtureEditModal(assignment);
                    }
                    else {
                      console.log("No matching role found in localStorage for Edit Assignment.");
                    }
                  }}
                >
                  Edit Assignment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AddAssignmentModal is for Operator role, so it remains here */}
      <AddAssignmentModal
        show={showModal}
        onClose={handleModalClose}
        initialData={editingAssignment}
        onSubmitSuccess={handleAssignmentSubmitted}
        employeeId={employeeId}
      />

      <ConfirmationModal
        show={showConfirmation}
        message="Are you sure you want to mark this assignment as complete?"
        onConfirm={handleConfirmComplete}
        onCancel={handleCancelComplete}
      />

      <Toast
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={handleCloseToast}
      />
    </div>
  );
}

export default AssignmentsPage;