import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaDumbbell } from "react-icons/fa";

const roles = [
  { id: 1, icon: <FaUser className="text-blue-500 text-3xl" />, label: "User" },
  { id: 2, icon: <FaUserTie className="text-green-500 text-3xl" />, label: "Owner" },
  { id: 3, icon: <FaDumbbell className="text-red-500 text-3xl" />, label: "Trainer" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRoleClick = (roleLabel) => {
    setFormData((prevData) => ({
      ...prevData,
      role: roleLabel,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/users/register", formData);
      console.log(res.data);
      navigate("/");
    } catch (err) {
      alert("Something went wrong, Please try again!");
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Join Dhairya</h2>
        <p className="text-gray-500 text-sm text-center mt-2">
          Join <span className="font-semibold text-gray-700">4600+ Developers</span> today!
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-slate-950 focus:outline-none transition"
            />
          </div>

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

          <div className="flex justify-center items-center space-x-6 mt-6">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                onClick={() => handleRoleClick(role.label)}
                className={`bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-28 h-28 border-2 hover:shadow-xl transition transform duration-200 ease-in-out ${
                  formData.role === role.label ? "border-slate-950 shadow-lg" : "border-gray-300"
                }`}
              >
                {role.icon}
                <p className="mt-2 text-gray-700">{role.label}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-start text-gray-600 text-sm">
            <input type="checkbox" id="terms" required className="mr-2 accent-slate-950" />
            <label htmlFor="terms">
              I agree with <a href="#" className="text-slate-950 underline">Terms & Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-slate-950 text-white font-semibold rounded-lg shadow-md hover:bg-slate-950 transition"
          >
            Join
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already joined? <a href="#" className="text-slate-950 font-semibold">Login now</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;