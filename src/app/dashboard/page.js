"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function SupportDeskDashboard() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            setUser(session?.user);
            fetchStats();
        } else {
            setUser(null);
        }
    }, [status, session]);

    async function fetchStats() {
        try {
            const response = await axios.get("/api/stats");
            if (response.data.success) {
                setStats(response.data);
                setLoading(false);
            } else {
                console.error("Failed to fetch stats:", response.data.error);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }

    if (loading) {
        return <div className="p-6 text-gray-600">Loading dashboard...</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Support Desk Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-700">Open Tickets</h3>
                        <p className="text-3xl font-bold text-blue-600">{stats.statusCount?.Open || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-700">In Progress</h3>
                        <p className="text-3xl font-bold text-yellow-500">{stats.statusCount?.["In Progress"] || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-700">Resolved</h3>
                        <p className="text-3xl font-bold text-green-600">{stats.statusCount?.Resolved || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-xl font-semibold text-black mb-4">Recent Tickets</h3>
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-black">
                                <th className="p-3 text-left border-b">ID</th>
                                <th className="p-3 text-left border-b">Lab</th>
                                <th className="p-3 text-left border-b">PC</th>
                                <th className="p-3 text-left border-b">Type</th>
                                <th className="p-3 text-left border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(stats.recentIssues)}
                            {stats.recentIssues?.map((issue, index) => (
                                <tr key={issue._id || index}>
                                    <td className="p-3 border-b text-black">{issue._id.slice(-5).toUpperCase()}</td>
                                    <td className="p-3 border-b text-black">{issue.labId?.labName}</td>
                                    <td className="p-3 border-b text-black">PC-{issue.pcNumber}</td>
                                    <td className="p-3 border-b text-black">{issue.issueType}</td>
                                    <td className={`p-3 border-b font-semibold ${getStatusColor(issue.status)}`}>
                                        {issue.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Utility for status colors
function getStatusColor(status) {
    switch (status) {
        case "Open":
            return "text-blue-600";
        case "In Progress":
            return "text-yellow-500";
        case "Resolved":
            return "text-green-600";
        default:
            return "text-gray-500";
    }
}
