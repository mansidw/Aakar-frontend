// src/services/generateReport.jsx
import axios from "axios";

/**
 * Generates a report by sending a user query to the backend API.
 *
 * @param {string} newMessage - The user's message/query.
 * @param {string} userId - The user's ID.
 * @param {string} projectId - The project ID.
 * @returns {Promise<Object>} An object containing the response type and content or file information.
 */
export const generateReport = async (newMessage, userId, projectId, selectedType) => {
  if (!newMessage || newMessage.trim().length === 0) {
    return { type: 'error', content: "Please enter a valid message." };
  }

  try {
    const response = await axios.post(
      "https://aakar-backend.onrender.com/reports/generate",
      {
        project_id: projectId,
        user_id: userId,
        query: newMessage,
        format: selectedType ?? "PDF", // You can change this to the desired format: "PDF", "DOCX", "MARKDOWN", etc.
      },
      {
         responseType: 'blob', // Important for handling binary data
      }
    );

    const contentType = response.headers['content-type'];
    const contentDisposition = response.headers['content-disposition'] || '';

    // Function to extract filename from content-disposition
    const getFileName = () => {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) return match[1];
      // Default filename based on content type
      if (contentType === 'application/pdf') return 'report.pdf';
      if (contentType === 'text/html') return 'report.html';
      if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'report.docx';
      if (contentType === 'text/markdown') return 'report.md';
      return 'report';
    };

    // Check the content type and categorize the response
    if (contentType.includes('application/pdf')) {
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const fileName = getFileName();
      return { type: 'pdf', url, fileName };
    } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const fileName = getFileName();
      return { type: 'docx', url, fileName };
    } else if (contentType.includes('text/html')) {
      const blob = new Blob([response.data], { type: contentType });
      const text = await blob.text();
      return { type: 'html', content: text };
    } else if (contentType.includes('text/markdown')) {
      const blob = new Blob([response.data], { type: contentType });
      const text = await blob.text();
      return { type: 'markdown', content: text };
    } else if (contentType.includes('application/json')) {
      // Handle JSON responses if any
      const text = await response.data.text();
      const json = JSON.parse(text);
      return { type: 'text', content: json.report };
    } else {
      // Unknown content type
      return { type: 'error', content: "Received an unknown response type." };
    }
  } catch (error) {
    console.error("Failed to generate report:", error);
    return { type: 'error', content: "Something went wrong, please try again." };
  }
};

