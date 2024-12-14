import React, { useState, useRef } from "react";
import {
  UserIcon,
  LockIcon,
  MailIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Base Authentication Layout Component
function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Particles/3D Effect */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/30 to-purple-900/30 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-600">
            {title}
          </h2>
          <p className="text-gray-300">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}

// Input Component
function AuthInput({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  name,
  showPasswordToggle = false,
  onPasswordToggle,
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400">
        <Icon size={20} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full 
          pl-10 
          pr-10 
          py-3 
          bg-white/10 
          border 
          border-white/20 
          rounded-lg 
          focus:outline-none 
          focus:ring-2 
          focus:ring-indigo-500 
          text-white 
          placeholder-gray-400
        "
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onPasswordToggle}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400"
        >
          {type === "password" ? (
            <EyeIcon size={20} />
          ) : (
            <EyeOffIcon size={20} />
          )}
        </button>
      )}
    </div>
  );
}

// Login Component
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://aakar-backend.onrender.com/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Response in login - ", response);
      if (response) {
        localStorage.setItem("username", response.data.name);
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userId", response.data.user_id);
        navigate("/project");
      } else {
        throw new Error("Login Issue Error");
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue to आकर AI">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          icon={MailIcon}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />

        <AuthInput
          icon={LockIcon}
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          showPasswordToggle
          onPasswordToggle={() => setShowPassword(!showPassword)}
        />

        <button
          type="submit"
          className="
            w-full 
            py-3 
            bg-indigo-600 
            hover:bg-indigo-700 
            rounded-lg 
            font-bold 
            transition 
            duration-300 
            transform 
            hover:scale-105
          "
        >
          Sign In
        </button>

        <div className="text-center">
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign Up
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}

// Signup Component
function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "https://aakar-backend.onrender.com/users/",
          {
            name: formData.email.match(/^[^@]+/)[0],
            email: formData.email,
            password: formData.password,
          }
        );

        if (response) {
          console.log("Response- ", response);
          navigate("/login");
        } else {
          throw new Error("User Creation error");
        }
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join आकर AI and transform your data"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          icon={MailIcon}
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}

        <AuthInput
          icon={LockIcon}
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          showPasswordToggle
          onPasswordToggle={() => setShowPassword(!showPassword)}
        />
        {errors.password && (
          <p className="text-red-400 text-sm">{errors.password}</p>
        )}

        <AuthInput
          icon={LockIcon}
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          showPasswordToggle
          onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
        )}

        <button
          type="submit"
          className="
            w-full 
            py-3 
            bg-indigo-600 
            hover:bg-indigo-700 
            rounded-lg 
            font-bold 
            transition 
            duration-300 
            transform 
            hover:scale-105
          "
        >
          Sign Up
        </button>
      </form>
    </AuthLayout>
  );
}

export { Login, Signup };
