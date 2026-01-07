import axios from "axios";

const putData = async (url, data, config = null) => {
  try {
    const response = await axios.put(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error("Error updating data: " + error.message);
  }
};

export default putData;
