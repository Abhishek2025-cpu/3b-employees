import axios from "axios";

const BASE_URL = "https://threeb-1067354145699.asia-south1.run.app/api/machines";

 const assignMachineWithOperator = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assign-machine`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Assign Machine API Error:", error.response?.data || error.message);
    throw error;
  }
};
export default assignMachineWithOperator;