"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function SupportDeskDashboard() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (status === "authenticated") {
            setUser(session?.user);
            console.log(user);
            fetchIssues();
        } else {
            setUser(null);
        }
    }, [status, session]);

    async function fetchIssues() {
        try{
            const response=await axios.get("/api/issue", {
                headers: {
                    Authorization: `Bearer ${session?.user?.token}`,
                },
            });
            console.log(response.data);
            if (response.data.success) {
                console.log("Issues fetched successfully:", response.data.issues);
            } else {
                console.error("Failed to fetch issues:", response.data.error);
            }
        }
        catch (error) {
            console.error("Error fetching issues:", error);
        }

    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-700">Open Tickets</h3>
                        <p className="text-3xl font-bold text-blue-600">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-700">In Progress</h3>
                        <p className="text-3xl font-bold text-yellow-500">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-medium text-gray-700">Resolved</h3>
                        <p className="text-3xl font-bold text-green-600">23</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                    <h3 className="text-xl font-semibold text-black mb-4">Recent Tickets</h3>
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-black">
                                <th className="p-3 text-left border-b">ID</th>
                                <th className="p-3 text-left border-b">Subject</th>
                                <th className="p-3 text-left border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-3 border-b text-black">#001</td>
                                <td className="p-3 border-b text-black">Software Issue</td>
                                <td className="p-3 border-b text-blue-600">Open</td>
                            </tr>
                            <tr>
                                <td className="p-3 border-b text-black">#002</td>
                                <td className="p-3 border-b text-black">Network Failure</td>
                                <td className="p-3 border-b text-yellow-500">In Progress</td>
                            </tr>
                            <tr>
                                <td className="p-3 border-b text-black">#003</td>
                                <td className="p-3 border-b text-black">Software (Access Denied)</td>
                                <td className="p-3 border-b text-green-600">Resolved</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
