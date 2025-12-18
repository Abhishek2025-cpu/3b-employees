import axios from "axios";

export const fetchAllMaterials = async () => {
  try {
    const response = await axios.get(
      "https://threebapi-1067354145699.asia-south1.run.app/api/items/get-Allitems"
    );

    return response.data;
  } catch (error) {
    console.error("Error in fetchAllMaterials:", error);
    return null;
  }
};