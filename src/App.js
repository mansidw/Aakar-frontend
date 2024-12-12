import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import { Project } from "./components/Project/Project";
import { Login, Signup } from "./components/auth/AuthComponents";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/project" element={<Project />} />
      </Routes>
    </Router>
  );
};

export default App;
