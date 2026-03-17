import axios from "axios";

export const getAssignmentsByEmployee = async (employeeId, lang = "en") => {
  try {
    const res = await axios.get(
      `https://threebapi-1067354145699.asia-south1.run.app/api/items/items/employee/${employeeId}`,
      {
        params: {
          lang: lang, // 👈 this is the important part
        },
      }
    );

    return res.data; // return full response (better)
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return null;
  }
};