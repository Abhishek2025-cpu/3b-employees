import axios from 'axios';

export const getAssignmentsByEmployee = async (employeeId) => {
  try {
    const res = await axios.get(
      `https://threebapi-1067354145699.asia-south1.run.app/api/items/items/employee/${employeeId}`
    );
    return res.data.data; // the assignments array
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
};
