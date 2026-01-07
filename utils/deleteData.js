import axios from "axios";

const deleteData = async (url, config) => {
  const response = await axios.delete(url, config);
  return response.data;
};

export default deleteData;
