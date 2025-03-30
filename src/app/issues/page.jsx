"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { FiEye, FiXCircle } from "react-icons/fi";
import { ClientSideRowModelModule } from "ag-grid-community";
import { formatDistanceToNow } from "date-fns";

export default function IssuesPage() {
  const { data: session, status } = useSession();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const gridRef = useRef();

  useEffect(() => {
    if (status === "authenticated") {
      fetchIssues();
    }
  }, [status]);

  async function fetchIssues() {
    try {
      const response = await axios.get("/api/issue", {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      if (response.data.success) {
        setIssues(response.data.issues);
      }
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  }

  async function updateStatus(issueId, newStatus) {
    try {
      await axios.put(`/api/issue/${issueId}`, { status: newStatus });
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      setSelectedIssue(null);
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  }

  

  const columns = [
    { 
      headerName: "Sr.No", 
      valueGetter: (params) => params.node.rowIndex + 1, 
      width: 80, 
      flex: 0.5,
      cellStyle: { padding: "12px" } 
    },
    { 
      headerName: "PC No.", 
      field: "pcNumber", 
      flex: 1, 
      sortable: true, 
      filter: true,
      cellStyle: { padding: "12px" } 
    },
    { 
      headerName: "Lab Name", 
      field: "labId.labName", 
      sortable: true, 
      flex: 1,
      cellStyle: { padding: "12px" } 
    },
    { 
      headerName: "Issue", 
      field: "issueType", 
      sortable: true, 
      flex: 1,
      cellStyle: { padding: "12px" } 
    },
    { 
      headerName: "Reporter", 
      field: "reportedBy.name", 
      sortable: true, 
      flex: 1,
      cellStyle: { padding: "12px" } 
    },
    {
      headerName: "Reported At",
      field: "reportedAt",
      flex: 1,
      cellRenderer: (params) => (
        <span className="px-3 py-1 block text-gray-600">
          {formatDistanceToNow(new Date(params.value), { addSuffix: true })}
        </span>
      ),
      cellStyle: { padding: "12px" }
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (params) => (
        <span className={`px-3 py-1 rounded-lg font-medium ${getStatusColor(params.value)}`}>
          {params.value}
        </span>
      ),
      cellStyle: { padding: "12px", textAlign: "center" }
    },
    {
      headerName: "Actions",
      field: "_id",
      flex: 0.7,
      cellRenderer: (params) => (
        <div className="flex justify-center space-x-3">
          <button 
            className="bg-blue-500 px-3 py-2 rounded-lg text-white hover:bg-blue-600 transition duration-200" 
            onClick={() => setSelectedIssue(params.data)}
            title="View Issue"
          >
            <FiEye size={18} />
          </button>
        </div>
      ),
      cellStyle: { padding: "12px", textAlign: "center" ,margin:"12px"}
    },
  ];
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Resolved":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Issue Tracker</h1>
        <div
          className="ag-theme-alpine shadow-md rounded-lg p-4"
          style={{ height: 600, width: "100%" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={issues}
            columnDefs={columns}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={5}
            rowSelection="multiple"
            modules={[ClientSideRowModelModule]}
          />
        </div>
      </div>

      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" onClick={() => setSelectedIssue(null)}>
              <FiXCircle size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Issue Details</h2>
            <p><strong>PC No:</strong> {selectedIssue.pcNumber}</p>
            <p><strong>Lab Name:</strong> {selectedIssue.labId.labName}</p>
            <p><strong>Issue:</strong> {selectedIssue.issueType}</p>
            <p><strong>Description:</strong> {selectedIssue.description}</p>
            <p><strong>Reporter:</strong> {selectedIssue.reportedBy.name}</p>
            <p><strong>Reported At:</strong> {new Date(selectedIssue.reportedAt).toLocaleString()} <span className="text-sm italic text-slate-400">{formatDistanceToNow(new Date(selectedIssue.reportedAt))} ago</span></p>
            <div className="mt-4">
              <label className="font-semibold">Status:</label>
              <select
                value={selectedIssue.status}
                onChange={(e) => updateStatus(selectedIssue._id, e.target.value)}
                className="ml-2 border px-3 py-1 rounded"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <button className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-900 w-full" onClick={() => setSelectedIssue(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}