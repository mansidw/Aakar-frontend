import React, { useState, useEffect, useRef } from "react";
import { SendIcon, MessageCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { generateReport } from "../chat/generateReport"; // Adjust path if needed
import Navbar from "../basic/Navbar";

// Fetch sessions for given user and project
const fetchSessions = async (userId, projectId) => {
  try {
    const response = await fetch(
      `https://aakar-backend.onrender.com/chats/sessions?user_id=${userId}&project_id=${projectId}`
    );
    const data = await response.json();
    // Sort sessions so the newest is at the top (descending by created_at)
    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
};

// Fetch chats for a given session
const fetchChatsInSession = async (sessionId) => {
  try {
    const response = await fetch(
      `https://aakar-backend.onrender.com/chats/session/${sessionId}`
    );
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return [];
  }
};

// Convert base64 to Blob URL (used for PDF and DOCX)
const base64ToBlobUrl = (b64Data, contentType) => {
  const byteCharacters = atob(b64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  return URL.createObjectURL(blob);
};

const ChatInterface = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [selectedType, setSelectedType] = useState("PDF");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const documentTypes = ["PDF", "HTML", "MARKDOWN", "DOCX"];

  const location = useLocation();
  const userId = location.state?.userId;
  const projectId = location.state?.projectId;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    // Fetch sessions for the current user and project
    if (userId && projectId) {
      fetchSessions(userId, projectId).then(setSessions);
    }
  }, [userId, projectId]);

  useEffect(() => {
    // Fetch chats when a session is selected
    if (selectedSession && selectedSession.session_id) {
      fetchChatsInSession(selectedSession.session_id).then(setChats);
    } else {
      setChats([]);
    }
  }, [selectedSession]);

  useEffect(() => {
    // Scroll to bottom of chat whenever chats change
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);

    const userMsg = { query: newMessage, format: null }; // user message on right
    const typingMsg = { query: "AI is thinking...", format: "TYPING" }; // special AI typing message

    // Add user message and typing message at once
    setChats((prev) => [...prev, userMsg, typingMsg]);

    const tempMessage = newMessage; // store query
    setNewMessage(""); // Clear input

    const response = await generateReport(
      tempMessage,
      userId,
      projectId,
      selectedType,
      selectedSession?.session_id
    );
    setIsLoading(false);

    // Refetch sessions and chats after generating report
    const updatedSessions = await fetchSessions(userId, projectId);
    setSessions(updatedSessions);

    let newSelectedSession = selectedSession;
    if (!newSelectedSession) {
      // If previously no session was selected, now the newest is updatedSessions[0]
      if (updatedSessions.length > 0) {
        newSelectedSession = updatedSessions[0];
        setSelectedSession(newSelectedSession);
      }
    }

    if (newSelectedSession && newSelectedSession.session_id) {
      const serverChats = await fetchChatsInSession(
        newSelectedSession.session_id
      );
      setChats(serverChats);
    } else {
      // If still no session, just clear chats
      setChats([]);
    }
  };

  const createNewSession = () => {
    // Clear current selection and chats to start fresh
    setSelectedSession(null);
    setChats([]);
  };

  // const deleteSession = (sessionToDelete) => {
  //   // Just remove from UI for now
  //   setSessions((prev) => prev.filter((session) => session.session_id !== sessionToDelete.session_id));
  //   if (selectedSession?.session_id === sessionToDelete.session_id) {
  //     setSelectedSession(null);
  //     setChats([]);
  //   }
  // };

  const deleteSessionFromServer = async (sessionId) => {
    try {
      const response = await fetch(
        `hhttps://aakar-backend.onrender.com/chats/session/${sessionId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        console.error("Failed to delete session");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting session:", error);
      return false;
    }
  };

  const deleteSession = async (sessionToDelete) => {
    const success = await deleteSessionFromServer(sessionToDelete.session_id);
    if (!success) return;

    setSessions((prev) =>
      prev.filter(
        (session) => session.session_id !== sessionToDelete.session_id
      )
    );
    if (selectedSession?.session_id === sessionToDelete.session_id) {
      setSelectedSession(null);
      setChats([]);
    }
  };

  // Render each chat object
  // If format is null: user query (right)
  // If format is "TYPING": AI typing (left) only
  // If format is actual (PDF, DOCX, MARKDOWN, HTML): user query (right), AI answer (left)
  const renderChats = () => {
    return chats.map((chat, idx) => {
      if (chat.format === "TYPING") {
        // AI typing message on left only
        return (
          <div key={idx + "-typing"} className="flex justify-start">
            <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
              <span className="text-gray-400">{chat.query}</span>
            </div>
          </div>
        );
      }

      // Always show user query on right first
      const userMessage = (
        <div key={idx + "-user"} className="flex justify-end">
          <div className="max-w-xl p-4 rounded-xl bg-indigo-600 text-white">
            {chat.query}
          </div>
        </div>
      );

      if (!chat.format) {
        // Just user query, no AI answer
        return <React.Fragment key={idx}>{userMessage}</React.Fragment>;
      }

      // AI answer
      let answerContent;
      if (chat.format === "PDF") {
        const url = base64ToBlobUrl(chat.file, "application/pdf");
        answerContent = (
          <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
            <iframe
              src={url}
              title="PDF Report"
              className="w-full h-64 mb-2"
            ></iframe>
            <a
              href={url}
              download="report.pdf"
              className="text-indigo-400 underline"
            >
              Download report.pdf
            </a>
          </div>
        );
      } else if (chat.format === "DOCX") {
        const url = base64ToBlobUrl(
          chat.file,
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        answerContent = (
          <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
            <a
              href={url}
              download="report.docx"
              className="text-indigo-400 underline"
            >
              Download report.docx
            </a>
          </div>
        );
      } else if (chat.format === "MARKDOWN") {
        answerContent = (
          <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
            <ReactMarkdown>{chat.markdown_content}</ReactMarkdown>
          </div>
        );
      } else if (chat.format === "HTML") {
        const sanitizedHTML = DOMPurify.sanitize(chat.markdown_content || "");
        answerContent = (
          <div
            className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md prose"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      } else {
        // Default text handling
        answerContent = (
          <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
            <ReactMarkdown>
              {chat.markdown_content || chat.query || "No content"}
            </ReactMarkdown>
          </div>
        );
      }

      const aiMessage = (
        <div key={idx + "-ai"} className="flex justify-start">
          {answerContent}
        </div>
      );

      return (
        <React.Fragment key={idx}>
          {userMessage}
          {aiMessage}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/10 backdrop-blur-md border-r border-white/20 p-4 flex flex-col">
        {/* underline text go back to projects with arrow right icon*/}
        <a href="/project" className="text-indigo-400 underline mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 25 25"
            className="inline-block w-4 h-4 mr-1"
            fill="currentColor"
          >
            <path
              d="M24 12.001H2.914l5.294-5.295-.707-.707L1 12.501l6.5 6.5.707-.707-5.293-5.293H24v-1z"
              data-name="Left"
            />
          </svg>
          Go back to Projects
        </a>
        <button
          onClick={createNewSession}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
        >
          <PlusIcon size={20} />
          <span>New Chat</span>
        </button>

        <div className="space-y-2 mt-4 flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-300">Chat Sessions</h3>
          {sessions.map((session) => (
            <div
              key={session.session_id}
              className={`flex justify-between items-center
                p-3 rounded-lg cursor-pointer
                transition duration-300
                ${
                  selectedSession?.session_id === session.session_id
                    ? "bg-indigo-600/30"
                    : "hover:bg-white/10"
                }
              `}
              onClick={() => setSelectedSession(session)}
            >
              <div className="flex items-center space-x-2">
                <MessageCircleIcon size={20} className="text-indigo-400" />
                <span>{session.title.slice(0,20).concat(" ...") || `Session ${session.session_id}`}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session);
                }}
                className="text-red-400 hover:text-red-600 transition duration-300"
              >
                <TrashIcon size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <Navbar />
        {/* <div className="p-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
          <h2 className="text-2xl font-bold">
            {selectedSession?.title ||
              localStorage.getItem("username") ||
              localStorage.getItem("userEmail")}
          </h2>
        </div> */}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chats.length > 0 ? (
            <>{renderChats()}</>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No messages yet. Start by typing a query.
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input (Always visible) */}
        <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
          <div className="flex space-x-2">
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className=" bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 w-40 rounded-lg flex items-center justify-between"
              >
                {selectedType.toUpperCase()}
                <svg
                  className={`ml-2 transform transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="white"
                  viewBox="0 0 16 16"
                >
                  <path d="M1.5 6.5l6 6 6-6H1.5z" />
                </svg>
              </button>

              {isDropdownOpen && (
                <ul
                  className="absolute z-10 top-[-140px] left-0 bg-gray-700 rounded-lg shadow-lg w-40 border border-gray-600"
                  style={{ maxHeight: "150px", overflowY: "auto" }}
                >
                  {documentTypes.map((type) => (
                    <li
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className="px-4 py-2 text-white hover:bg-gray-600 cursor-pointer"
                    >
                      {type.toUpperCase()}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && handleSendMessage()
              }
              placeholder="Type your message..."
              className="
                flex-1
                bg-white/10
                border border-white/20
                rounded-lg
                p-3
                text-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
              disabled={isLoading}
            />

            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="
                bg-indigo-600
                hover:bg-indigo-700
                text-white
                p-3
                rounded-lg
                transition
                duration-300
                transform
                hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <SendIcon size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
