"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';



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
                console.log(response.data);
                setLoading(false);
            } else {
                console.error("Failed to fetch stats:", response.data.error);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }


    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-600 text-center mt-6">Preparing dashboard data...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-6">ZCOER's Support Desk Dashboard (Staff)</h2>
                        <p className="mt-2 mb-3">Welcome {user.name} you have,</p>
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
    
                        <div>
                            <h3 className="text-2xl mt-5 font-semibold text-black mb-4">Lab Details</h3>
                            <LabDetails stats={stats} />
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
                    </>
                )}
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


const LabDetails = ({ stats }) => {
    const COLORS = ['#4CAF50', '#2196F3', '#F44336'];
    return (
        <div>
         
            {stats.labStats?.map((lab, index) => {
                const remainingPCs = lab.totalPCs - lab.workingPCs - lab.faultyPCs;
                const chartData = [
                    { name: 'Working PCs', value: lab.workingPCs },
                    { name: 'Faulty PCs', value: lab.faultyPCs },
                    { name: 'Remaining PCs', value: remainingPCs > 0 ? remainingPCs : 0 },
                ];

                return (
                    <div className="">
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md mt-4">
                        <h4 className="text-xl font-semibold text-black">{lab.labName}</h4>
                        <p className="text-gray-600">Total PCs: {lab.totalPCs}</p>
                        <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
                            <div>
                                <PieChart width={250} height={250}>
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {chartData.map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p>Working PCs: {lab.workingPCs}</p>
                                <p>Faulty PCs: {lab.faultyPCs}</p>
                                <p>Unaccounted PCs: {remainingPCs > 0 ? remainingPCs : 0}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                );
            })}

        </div>
        
    );
};
