import Instance from "./instance";

export const fetchData = async (endpoint) => {
  try {
    const response = await Instance.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data", error);
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await Instance.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data", error);
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await Instance.put(endpoint, data);
    console.log("===response==", response);
    return response.data;
  } catch (error) {
    console.error("Error updating data", error);
    throw error;
  }
};

export const deleteData = async (endpoint, data) => {
  try {
    const response = await Instance.delete(endpoint, { data });
    return response.data;
  } catch (error) {
    console.error("Error deleting data", error);
    throw error;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const response = await Instance.patch(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error patching data", error);
    throw error;
  }
};

