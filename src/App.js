import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import { Project } from "./components/Project/Project";
import { Login, Signup } from "./components/auth/AuthComponents";
import ChatInterface from "./components/chat/Chat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/project" element={<Project />} />
        <Route path="/chat" element={<ChatInterface />} />
      </Routes>
    </Router>
  );
};

export default App;
