import axios from "axios";

const uploadFiles = async (files, projectId) => {
  // Check if files and projectId are provided
  if (!files || files.length === 0) {
    console.error("No files provided for upload.");
    return;
  }
  if (!projectId) {
    console.error("Project ID is required for upload.");
    return;
  }

  // Prepare the FormData
  const formData = new FormData();
  for (let file of files) {
    formData.append("files", file); // Add each file to the FormData object
  }
  formData.append("project_id", projectId); // Add the project ID

  try {
    // Axios POST request
    const response = await axios.post("http://127.0.0.1:5000/uploads/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Handle the response
    if (response.status === 200) {
      console.log("Upload Success:", response.data.success);
      console.log("Upload Errors:", response.data.errors);
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    // Handle errors
    console.error("Error uploading files:", error);
  }
};

export default uploadFiles;
