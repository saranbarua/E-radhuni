import axios from "axios";

const postData = async (url, data, config = null) => {
  const response = await axios.post(url, data, config);
  return response.data;
};

export default postData;
