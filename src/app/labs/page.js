"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Lab() {
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentLabId, setCurrentLabId] = useState(null);
    const [formData, setFormData] = useState({ labName: "", totalPCs: "" });

    useEffect(() => {
        fetchLabs();
    }, []);

    async function fetchLabs() {
        try {
            const response = await fetch("/api/labs");
            const data = await response.json();
            if (data.success) {
                setLabs(data.labs);
            } else {
                setError("Failed to load labs.");
            }
        } catch (err) {
            setError("Error fetching data.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddOrEdit = async (e) => {
        e.preventDefault();
        const { labName, totalPCs } = formData;

        if (!labName || !totalPCs) {
            alert("Please fill in all fields.");
            return;
        }

        const payload = { labName, totalPCs: Number(totalPCs) };

        try {
            if (isEditing) {
                // Update lab
                const response = await fetch(`/api/labs/${currentLabId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (data.success) {
                    setLabs(labs.map((lab) => (lab._id === currentLabId ? data.lab : lab)));
                } else {
                    alert(data.error || "Failed to update lab.");
                }
            } else {
                // Add new lab
                const response = await fetch("/api/labs/add", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (data.success) {
                    setLabs([...labs, data.lab]);
                } else {
                    alert(data.error || "Failed to add lab.");
                }
            }

            setShowModal(false);
            setFormData({ labName: "", totalPCs: "" });
            setIsEditing(false);
            setCurrentLabId(null);
        } catch (error) {
            console.error("Error submitting lab:", error);
        }
    };

    const handleEditClick = (lab) => {
        setFormData({ labName: lab.labName, totalPCs: lab.totalPCs });
        setCurrentLabId(lab._id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (!confirm("All data realted to this Lab can also be deleted. Are you sure to delete this lab?")) return;

        try {
            const response = await fetch(`/api/labs/${id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                setLabs(labs.filter((lab) => lab._id !== id));
            } else {
                alert(data.error || "Failed to delete lab.");
            }
        } catch (error) {
            console.error("Error deleting lab:", error);
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-center text-blue-700">Labs in Your Department</h1>
                {loading && <p className="text-center text-gray-500">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => {
                            setShowModal(true);
                            setIsEditing(false);
                            setFormData({ labName: "", totalPCs: "" });
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        Add New Lab
                    </button>
                </div>

                {!loading && labs.length > 0 && (
                    <div className="overflow-x-auto mt-6">
                        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
                            <thead className="bg-blue-200">
                                <tr>
                                    <th className="py-3 px-4 text-left text-blue-900">Lab Name</th>
                                    <th className="py-3 px-4 text-left text-blue-900">Total PCs</th>
                                    <th className="py-3 px-4 text-left text-blue-900">Working PCs</th>
                                    <th className="py-3 px-4 text-left text-blue-900">Faulty PCs</th>
                                    <th className="py-3 px-4 text-left text-blue-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {labs.map((lab) => (
                                    <tr key={lab._id} className="border-t border-gray-300">
                                        <td className="py-3 px-4">{lab.labName}</td>
                                        <td className="py-3 px-4">{lab.totalPCs}</td>
                                        <td className="py-3 px-4">{lab.workingPCs}</td>
                                        <td className="py-3 px-4">{lab.faultyPCs}</td>
                                        <td className="py-3 px-4 flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(lab)}
                                                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(lab._id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold text-blue-700 mb-4">
                                {isEditing ? "Edit Lab" : "Add a New Lab"}
                            </h2>
                            <form onSubmit={handleAddOrEdit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Lab Name</label>
                                    <input
                                        type="text"
                                        name="labName"
                                        value={formData.labName}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total PCs</label>
                                    <input
                                        type="number"
                                        name="totalPCs"
                                        value={formData.totalPCs}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        required
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setIsEditing(false);
                                            setFormData({ labName: "", totalPCs: "" });
                                        }}
                                        className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                                    >
                                        {isEditing ? "Update" : "Add Lab"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
