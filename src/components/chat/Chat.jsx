import React, { useState, useEffect, useRef } from "react";
import { SendIcon, MessageCircleIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

// Mock data and service function (replace with actual API calls)
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

const ChatInterface = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const location = useLocation();

  const userId = location.state?.userId;
  const projectId = location.state?.projectId;

  useEffect(() => {
    // Fetch sessions for the current user (mock user ID)
    fetchSessions(userId).then(setSessions);
  }, []);

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

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Placeholder for sending message logic
    const userMessage = {
      id: Date.now(),
      content: newMessage,
      sender: "user",
    };

    setChats((prevChats) => [...prevChats, userMessage]);
    setNewMessage("");

    // Simulate AI response (replace with actual backend call)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: "This is a sample AI response.",
        sender: "ai",
      };
      setChats((prevChats) => [...prevChats, aiResponse]);
    }, 1000);
  };

  const createNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      name: `New Session ${sessions.length + 1}`,
    };
    setSessions((prev) => [...prev, newSession]);
    setSelectedSession(newSession);
  };

  const deleteSession = (sessionToDelete) => {
    setSessions((prev) =>
      prev.filter((session) => session.id !== sessionToDelete.id)
    );
    if (selectedSession?.id === sessionToDelete.id) {
      setSelectedSession(null);
      setChats([]);
    }
  };

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
              className={`
                flex justify-between items-center 
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
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`
                  flex ${
                    chat.sender === "user" ? "justify-end" : "justify-start"
                  }
                `}
              >
                <div
                  className={`
                    max-w-xl p-4 rounded-xl
                    ${
                      chat.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-white/10 backdrop-blur-md"
                    }
                  `}
                >
                  {chat.content}
                </div>
              </div>
            ))
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
