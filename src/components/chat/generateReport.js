import axios from "axios";

export const generateReport = async (newMessage, userId, projectId) => {
  if (!newMessage || newMessage.length === 0) {
    return "Something went wrong, try again!";
  }

  const response = await axios.post(`http://127.0.0.1:5000/reports/generate`, {
    project_id: projectId,
    user_id: userId,
    query: newMessage,
    format: "HTML",
  });

  console.log("Reponse generated from AI  - ", response);

  if (response && response.data) {
    return response.data;
  } else {
    return "Something went wrong, try again!";
  }
};
