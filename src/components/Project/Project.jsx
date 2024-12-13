import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon, FolderIcon, DownloadIcon } from "lucide-react";
import Navbar from "../basic/Navbar";
import axios from "axios";
import uploadFiles from "./uploadFiles";
import { useNavigate } from "react-router-dom";

export function Project() {
  const navigate = useNavigate("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const projectId = localStorage.getItem("projectId");
  const [newProject, setNewProject] = useState({ name: "", description: "" });

  useEffect(() => {
    const getProjectsByUserId = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `https://aakar-backend.onrender.com/projects/user/${userId}`
          );
          if (response && response.data && response.data.length > 0) {
            setProjects(response.data);
          } else {
            throw new Error("Error to get Projects");
          }
        } catch (error) {
          alert(error);
        }
      }
    };

    getProjectsByUserId();
  }, []);

  const getUserUploadedFiles = async () => {
    if (projectId) {
      try {
        const response = await axios.get(
          `https://aakar-backend.onrender.com/projects/${projectId}/files`
        );
        if (response && response.data) {
          setSelectedFiles(response.data.files);
        } else {
          throw new Error("Error to get uploaded files");
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    if (projectId) {
      getUserUploadedFiles();
    }
  }, [projectId]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewProject({ name: "", description: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name) {
      alert("Project name is required!");
      return;
    }

    try {
      const response = await axios.post("https://aakar-backend.onrender.com/projects/", {
        user_id: localStorage.getItem("userId"),
        project_name: newProject.name,
      });
      if (response) {
        localStorage.setItem("projectId", response.data.project_id);
        setProjects((prev) => [...prev, response.data]);
      } else {
        throw new Error("Project creation Error");
      }
    } catch (error) {
      alert(error);
    }

    closeModal();
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    localStorage.setItem("projectId", project.project_id);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const projectId = localStorage.getItem("projectId");

    const fileUpload = await uploadFiles(files, projectId);

    if (fileUpload) {
      alert(
        `Uploaded ${files.length} file(s) to project: ${selectedProject.project_name}`
      );
      getUserUploadedFiles();
    }

    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white overflow-hidden relative">
      <Navbar />
      {/* Header with Create New Project Button */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <button
          onClick={openModal}
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
        >
          <PlusIcon className="mr-2" /> Create New Project
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 container mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">
        {/* Sidebar with Project List */}
        <aside className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
          <h3 className="text-2xl font-bold mb-4 text-white">Projects</h3>
          {projects && projects?.length === 0 ? (
            <p className="text-gray-300">No projects created yet.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((project) => (
                <li
                  key={project.project_id}
                  onClick={() => handleProjectClick(project)}
                  className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition duration-300 transform hover:scale-105"
                >
                  <FolderIcon className="mr-3 text-indigo-400" size={24} />
                  <span>{project.project_name}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-2 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl">
          {selectedProject ? (
            <div className="space-y-6">
              <div className="existing-files">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Existing Files in {selectedProject.project_name}
                </h3>
                <div className="bg-white/5 border border-white/20 rounded-lg">
                  <ul className="divide-y divide-white/10">
                    {selectedFiles.length > 0 &&
                      selectedFiles.map((file) => (
                        <li
                          key={file.id}
                          className="p-4 flex justify-between items-center hover:bg-white/10 transition duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="bg-indigo-600/30 p-2 rounded-lg">
                              <span className="text-indigo-400 font-semibold">
                                {file.file_type}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-400">
                                {file.size}
                              </p>
                            </div>
                          </div>
                          <button
                            className="text-gray-400 hover:text-white transition duration-300"
                            // Add download or view functionality
                            // onClick={() => handleFileDownload(file)}
                          >
                            <DownloadIcon size={20} />
                          </button>
                        </li>
                      ))}
                  </ul>

                  {selectedFiles.length === 0 && (
                    <p className="text-gray-300">No files uploaded yet.</p>
                  )}
                </div>
              </div>
              <div className="file-upload">
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Upload Files to {selectedProject.project_name}
                </h3>
                <div className="bg-white/5 border border-white/20 p-4 rounded-lg">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:py-2 file:px-4"
                  />
                </div>
                <button
                  onClick={() =>
                    navigate("/chat", {
                      state: {
                        userId: localStorage.getItem("userId"),
                        projectId: localStorage.getItem("projectId"),
                      },
                    })
                  }
                  className="ml-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105"
                  style={{ marginTop: 20 }}
                >
                  Start Chat
                </button>
              </div>
            </div>
          ) : (
            <div className="welcome text-center py-12">
              <h2 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
                Welcome
              </h2>
              <p className="text-xl text-gray-300">
                Click "Create New Project" to get started.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal for Creating a New Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl w-full max-w-md mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Create New Project
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
                    Project Description
                  </label>
                  <textarea
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24"
                  ></textarea>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 border border-white/30 text-white hover:bg-white/10 font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Project;
