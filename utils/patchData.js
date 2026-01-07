import axios from "axios";

const patchData = async (url, data, config) => {
  const response = await axios.patch(url, data, config);

  return response.data;
};

export default patchData;
