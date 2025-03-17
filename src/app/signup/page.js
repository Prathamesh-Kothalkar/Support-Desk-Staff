"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffSignup() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    staffId: "",
    name: "",
    email:"",
    department: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/signup", formData);
      alert(response.data.message || "Signup successful! Redirecting to login...");
      router.push("/signin");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error during signup.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-200">
      <form
        className="p-8 bg-white text-gray-700 rounded-lg shadow-lg w-full max-w-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Staff Registration
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Staff ID</label>
            <input
              type="text"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Staff Email</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="ECE">ECE</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Signup
        </button>
        <p className="mt-3 text-sm text-center text-slate-500">
          Already registered?
          <span className="text-blue-800 underline">
            <Link href="/signin"> Sign in here</Link>
          </span>
        </p>
      </form>
    </div>
  );
}