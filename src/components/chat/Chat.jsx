// src/components/ChatInterface.jsx
import React, { useState, useEffect, useRef } from "react";
import { SendIcon, MessageCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { generateReport } from "./generateReport";

/**
 * Mock service functions.
 * Replace these with actual API calls as needed.
 */
const fetchSessions = async (userId) => {
  try {
    const response = await fetch(`/sessions?user_id=${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
};

const fetchChatsInSession = async (sessionId) => {
  try {
    const response = await fetch(`/session/${sessionId}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch chats:", error);
    return [];
  }
};

/**
 * ChatInterface Component
 *
 * Renders the chat interface, handles sending messages, and displays chat history.
 */
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
    // Fetch sessions for the current user
    if (userId) {
      fetchSessions(userId).then(setSessions);
    }
  }, [userId]);

  useEffect(() => {
    // Fetch chats when a session is selected
    if (selectedSession) {
      fetchChatsInSession(selectedSession.id).then(setChats);
    }
  }, [selectedSession]);

  useEffect(() => {
    // Scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  /**
   * Handles sending a new message.
   * Sends the user's message and handles the AI's response.
   */
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: newMessage,
      sender: "user",
    };

    setChats((prevChats) => [...prevChats, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    // Generate report based on the user's message
    const response = await generateReport(newMessage, userId, projectId, selectedType);

    setTimeout(() => {
      let aiResponse;
      switch (response.type) {
        case "pdf":
          aiResponse = {
            id: Date.now() + 1,
            type: "pdf",
            url: response.url,
            fileName: response.fileName,
            sender: "ai",
          };
          break;
        case "docx":
          aiResponse = {
            id: Date.now() + 1,
            type: "docx",
            url: response.url,
            fileName: response.fileName,
            sender: "ai",
          };
          break;
        case "html":
          aiResponse = {
            id: Date.now() + 1,
            type: "html",
            content: response.content,
            sender: "ai",
          };
          break;
        case "markdown":
          aiResponse = {
            id: Date.now() + 1,
            type: "markdown",
            content: response.content,
            sender: "ai",
          };
          break;
        case "text":
          aiResponse = {
            id: Date.now() + 1,
            type: "text",
            content: response.content,
            sender: "ai",
          };
          break;
        case "error":
          aiResponse = {
            id: Date.now() + 1,
            type: "error",
            content: response.content,
            sender: "ai",
          };
          break;
        default:
          aiResponse = {
            id: Date.now() + 1,
            type: "error",
            content: "Unknown response type.",
            sender: "ai",
          };
          break;
      }

      setChats((prevChats) => [...prevChats, aiResponse]);
      setIsLoading(false);
    }, 1000); // Simulate AI response delay
  };

  /**
   * Creates a new chat session.
   */
  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      name: `New Session ${sessions.length + 1}`,
    };
    setSessions((prev) => [...prev, newSession]);
    setSelectedSession(newSession);
  };

  /**
   * Deletes an existing chat session.
   *
   * @param {Object} sessionToDelete - The session to delete.
   */
  const deleteSession = (sessionToDelete) => {
    setSessions((prev) =>
      prev.filter((session) => session.id !== sessionToDelete.id)
    );
    if (selectedSession?.id === sessionToDelete.id) {
      setSelectedSession(null);
      setChats([]);
    }
  };

  /**
   * Renders the chat content based on its type.
   *
   * @param {Object} chat - The chat message object.
   * @returns {JSX.Element} - The rendered chat content.
   */
  const renderChatContent = (chat) => {
    switch (chat.type) {
      case "html":
        // Sanitize the HTML content before rendering
        const sanitizedHTML = DOMPurify.sanitize(chat.content);
        return (
          <div
            className="prose prose-indigo max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
          />
        );
      case "markdown":
        return <ReactMarkdown>{chat.content}</ReactMarkdown>;
      case "pdf":
        return (
          <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <iframe
                src={chat.url}
                title={chat.fileName}
                className="w-full h-64 mb-2"
              ></iframe>
              <a
                href={chat.url}
                download={chat.fileName}
                className="text-indigo-400 underline"
              >
                Download {chat.fileName}
              </a>
            </div>
          </div>
        );
      case "docx":
        return (
          <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
            <a
              href={chat.url}
              download={chat.fileName}
              className="text-indigo-400 underline"
            >
              Download {chat.fileName}
            </a>
          </div>
        );
      case "text":
        return (
          <div
            className={`max-w-xl p-4 rounded-xl ${
              chat.sender === "user"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 backdrop-blur-md"
            }`}
          >
            {chat.content}
          </div>
        );
      case "error":
        return (
          <div className="max-w-xl p-4 rounded-xl bg-red-600 text-white">
            {chat.content}
          </div>
        );
      default:
        return (
          <div
            className={`max-w-xl p-4 rounded-xl ${
              chat.sender === "user"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 backdrop-blur-md"
            }`}
          >
            {chat.content}
          </div>
        );
    }
  };

  // Cleanup object URLs when component unmounts or chats change
  useEffect(() => {
    return () => {
      chats.forEach((chat) => {
        if (chat.type === "pdf" || chat.type === "docx") {
          URL.revokeObjectURL(chat.url);
        }
      });
    };
  }, [chats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/10 backdrop-blur-md border-r border-white/20 p-4 space-y-4">
        <button
          onClick={createNewSession}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105"
        >
          <PlusIcon size={20} />
          <span>New Chat</span>
        </button>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-300">Chat Sessions</h3>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`flex justify-between items-center
                p-3 rounded-lg cursor-pointer
                transition duration-300
                ${
                  selectedSession?.id === session.id
                    ? "bg-indigo-600/30"
                    : "hover:bg-white/10"
                }
              `}
              onClick={() => setSelectedSession(session)}
            >
              <div className="flex items-center space-x-2">
                <MessageCircleIcon size={20} className="text-indigo-400" />
                <span>{session.name || `Session ${session.id}`}</span>
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
        <div className="p-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
          <h2 className="text-2xl font-bold">
            {selectedSession?.name || "Select a Chat"}
          </h2>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {selectedSession ? (
            <>
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex ${
                    chat.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {renderChatContent(chat)}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-xl p-4 rounded-xl bg-white/10 backdrop-blur-md">
                    <span className="text-gray-400">AI is typing...</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select or create a chat session to begin
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input */}
        {selectedSession && (
          <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="flex space-x-2">
              {/* Dropdown */}

              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="  bg-gray-700 
      hover:bg-gray-800
      text-white
      px-4
      py-2
      w-40
      rounded-lg
      flex
      items-center
      justify-between"
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
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
              />

              <button
                onClick={handleSendMessage}
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
                "
              >
                <SendIcon size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
