import React, { useEffect, useState } from 'react';
import { getAssignmentsByEmployee } from '../api/allApi/getAsignMachine.js';

function AssignmentsPage() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchAssignments = async () => {
    const employeeId = "685b9e7e6ae8ae163e290e5a"; // hardcoded for now
    if (!employeeId) {
      setLoading(false);
      return;
    }

    try {
      const data = await getAssignmentsByEmployee(employeeId);
      console.log("Assignments:", data);
      setAssignments(data || []); // ensure array
    } catch (err) {
      console.error(err);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };
  fetchAssignments();
}, []);



    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Assigned Tasks</h1>
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <ul>
                    {assignments.map(a => (
                        <li key={a._id}>
                            <strong>Machine:</strong> {a.machine?.name} |
                            <strong>Main Item:</strong> {a.mainItem?.name} |
                            <strong>Employees:</strong> {a.employees.map(e => e.name).join(', ')}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AssignmentsPage;
