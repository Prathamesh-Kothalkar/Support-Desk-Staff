"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    staffId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        staffId: formData.staffId,
        password: formData.password,
      });
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred during sign-in.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        className="p-8 bg-white text-gray-700 rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Staff Sign In
        </h1>
        <div className="mb-4">
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
        <div className="mb-4">
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
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Sign In
        </button>
        <p className="mt-3 text-sm text-center text-gray-500">
          Don't have an account? <Link href="/signup" className="text-blue-800 underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}
