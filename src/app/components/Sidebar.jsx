"use client";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Home, Ticket, CheckCircle, Laptop, LogOut, Menu, X, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    const router=useRouter();

    return (
        <>
            {/* Sidebar Toggle Button (Mobile) */}
            <button 
                className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside 
                className={`fixed top-0 left-0 h-full bg-white w-64 p-5 shadow-lg transform transition-transform 
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
            >
                {/* Close Button (Mobile) */}
                <button 
                    className="md:hidden absolute top-4 right-4 text-gray-600"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Sidebar Header */}
                <h2 className="text-xl font-semibold text-black mb-6">Support Desk</h2>

                {/* Navigation */}
                <nav>
                    <ul className="space-y-4">
                        <li className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                         onClick={()=>router.push("/dashboard")}>
                            <Home className="w-5 h-5 mr-2"  /> Hello, {user?.name || "Guest"}
                        </li>
                        <li className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                        onClick={()=>router.push("/issues")}>
                            <Ticket className="w-5 h-5 mr-2" /> Tickets
                        </li>
                        <li className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                         onClick={()=>router.push("/complaints")}>
                            <CheckCircle className="w-5 h-5 mr-2" /> Resolved
                        </li>
                        <li className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                        onClick={()=>router.push("/labs")}>
                            <Laptop className="w-5 h-5 mr-2" /> Labs
                        </li>
                        {
                            user ? 
                                <li 
                                    className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                                    onClick={() => signOut()}
                                >
                                    <LogOut className="w-5 h-5 mr-2" /> Sign Out
                                </li>
                            :<li 
                            className="flex items-center text-black p-2 rounded-md hover:bg-gray-200 cursor-pointer"
                            onClick={()=>router.push("/signin")}
                        >
                            <LogIn className="w-5 h-5 mr-2" /> Sign in
                        </li>
                        }
                    </ul>
                </nav>
            </aside>

            {/* Overlay for Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
