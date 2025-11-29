import axios from "axios";

const BASE_URL = "https://threebapi-1067354145699.asia-south1.run.app/api"; //temprary

/**
 * Sends worker task data to the backend (Add Task)
 * @param {Object} payload - The worker task data
 * @returns {Promise<{ success: boolean, message: string, data?: any }>}
 */
const assignMachineWithOperator = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}/workers/add-task`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Normalize the API response format
    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: response.data.message || "Worker task created successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: response.data.message || "Unexpected server response",
    };
  } catch (error) {
    console.error("❌ Error in assignMachineWithOperator:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create worker task",
    };
  }
};

export default assignMachineWithOperator;
