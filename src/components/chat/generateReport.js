import axios from "axios";

/**
 * Generates a report by sending a user query to the backend API.
 */
export const generateReport = async (newMessage, userId, projectId, selectedType, sessionId) => {
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
        format: selectedType ?? "PDF",
        session_id: sessionId
      },
      {
        responseType: 'blob', // Important for handling binary data
      }
    );

    const contentType = response.headers['content-type'];
    const contentDisposition = response.headers['content-disposition'] || '';

    const getFileName = () => {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) return match[1];
      if (contentType === 'application/pdf') return 'report.pdf';
      if (contentType === 'text/html') return 'report.html';
      if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'report.docx';
      if (contentType === 'text/markdown') return 'report.md';
      return 'report';
    };

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
      const text = await response.data.text();
      const json = JSON.parse(text);
      return { type: 'text', content: json.report };
    } else {
      return { type: 'error', content: "Received an unknown response type." };
    }
  } catch (error) {
    console.error("Failed to generate report:", error);
    return { type: 'error', content: "Something went wrong, please try again." };
  }
};
