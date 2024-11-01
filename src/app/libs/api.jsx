import axios from "axios";

export const fetchData = async (endpoint) => {
  try {
    const response = await axios.get(`/api/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`/api/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw new Error("Failed to post data");
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await axios.put(`/api/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw new Error("Failed to post data");
  }
};

export const deleteData = async (endpoint, data) => {
  try {
    const response = await axios.delete(`/api/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw new Error("Failed to post data");
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const response = await axios.patch(`/api/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error posting data:", error);
    throw new Error("Failed to post data");
  }
};
