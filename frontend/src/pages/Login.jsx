import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting formData:", formData);

    if (!formData.email || !formData.password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/users/login",
        formData,
        { headers: { "Content-Type": "application/json" } } // ✅ Send JSON
      );

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        navigate("/");
      } else {
        alert("Login failed! Incorrect email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.error || "Something went wrong. Try again!");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-sm text-center mt-2">
          Join <span className="font-semibold text-gray-700">4600+ Developers</span> today!
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-950 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password (min. 8 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-950 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-950 text-white font-semibold rounded-lg shadow-md hover:bg-slate-950 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          New Here? <a href="/signup" className="text-blue-500 font-semibold">Join now</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
