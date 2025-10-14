import axios from 'axios';

export const getAssignmentsByEmployee = async (employeeId) => {
  try {
    const res = await axios.get(
      `https://threebtest.onrender.com/api/machines/get-asign-machine/${employeeId}`
    );
    return res.data.data; // the assignments array
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};
