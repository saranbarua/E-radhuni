const fetchData = async (url, config) => {
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error: ${errorMessage || response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Network error: ${error.message}`);
  }
};

export default fetchData;
