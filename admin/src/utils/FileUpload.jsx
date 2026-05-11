import { message } from "antd";
import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL;

export const handleUpload = async (file) => {
  if (!file) {
    message.error("Please select a file to upload");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log("iam here 1 ");
    const response = await axios.post(
      `${baseURL}api/image/uploadImage`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("iam here 2 ");
    // Safely extract URL from response
    const imageUrl =
      response?.data?.imagePath1 ||
      response?.data?.imagePath ||
      response?.data?.url ||
      null;

    if (imageUrl) {
      message.success("Image uploaded successfully!");
      return imageUrl;
    } else {
      message.error("Upload failed: no image URL returned from server");
      return null;
    }
  } catch (error) {
    console.error("Error uploading image:", error?.response || error?.message);
    message.error(
      error?.response?.data?.message || "Image upload failed. Please try again."
    );
    return null;
  }
};