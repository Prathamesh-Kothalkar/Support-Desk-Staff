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
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

export default function IssuesPage() {
  const { data: session, status } = useSession();
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [updating, setUpdating] = useState(false);
  const gridRef = useRef();
  ModuleRegistry.registerModules([AllCommunityModule]);

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
      setUpdating(true);
      await axios.put(`/api/issue/${issueId}`, { status: newStatus });
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue._id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
      setSelectedIssue((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Error updating issue status:", error);
    } finally {
      setUpdating(false);
    }
  }

  const columns = [
    {
      headerName: "Sr.No",
      valueGetter: (params) => params.node.rowIndex + 1,
      width: 80,
      flex: 0.5,
      cellClass: "ag-cell-custom",
    },
    {
      headerName: "PC No.",
      field: "pcNumber",
      flex: 1,
      sortable: true,
      filter: true,
      cellClass: "ag-cell-custom",
    },
    {
      headerName: "Lab Name",
      field: "labId.labName",
      cellRenderer: (params) => (
        <span className="text-slate-600">
          {params.value || "Deleted Lab"}
        </span>
      ),
      sortable: true,
      flex: 1,
      cellClass: "ag-cell-custom",
    },
    {
      headerName: "Issue",
      field: "issueType",
      sortable: true,
      flex: 1,
      cellClass: "ag-cell-custom",
    },
    {
      headerName: "Reporter",
      field: "reportedBy.name",
      sortable: true,
      flex: 1,
      cellClass: "ag-cell-custom",
    },
    {
      headerName: "Reported At",
      field: "reportedAt",
      flex: 1,
      cellRenderer: (params) => (
        <span className="text-slate-600">
          {formatDistanceToNow(new Date(params.value), { addSuffix: true })}
        </span>
      ),
      cellClass: "ag-cell-custom",
    },
    {
      headerName: "Status",
      field: "status",
      flex: 1,
      cellRenderer: (params) => (
        <span
          className={`px-3 py-1 rounded-lg font-semibold text-sm ${getStatusColor(
            params.value
          )}`}
        >
          {params.value}
        </span>
      ),
      cellClass: "ag-cell-custom text-center",
    },
    {
      headerName: "Actions",
      field: "_id",
      flex: 0.7,
      cellRenderer: (params) => (
        <div className="flex justify-center items-center">
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg"
            onClick={() => setSelectedIssue(params.data)}
          >
            <FiEye size={16} />
          </button>
        </div>
      ),
      cellClass: "ag-cell-custom text-center",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-tr from-slate-100 to-white">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Issue Tracker</h1>
        <div
          className="ag-theme-alpine bg-white shadow-lg rounded-xl p-4 border border-gray-200"
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
            paginationPageSize={20}
            rowSelection="single"
            modules={[ClientSideRowModelModule]}
          />
        </div>
      </div>

      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedIssue(null)}
            >
              <FiXCircle size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Issue Details
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>PC No:</strong> {selectedIssue.pcNumber}
              </p>
              <p>
                <strong>Lab Name:</strong> {selectedIssue.labId.labName}
              </p>
              <p>
                <strong>Issue:</strong> {selectedIssue.issueType}
              </p>
              <p>
                <strong>Description:</strong> {selectedIssue.description}
              </p>
              <p>
                <strong>Reporter:</strong> {selectedIssue.reportedBy.name}
              </p>
              <p>
                <strong>Reported At:</strong> {new Date(selectedIssue.reportedAt).toLocaleString()} <span className="text-sm italic text-gray-400">({formatDistanceToNow(new Date(selectedIssue.reportedAt))} ago)</span>
              </p>

              <div className="pt-4">
                <label className="font-semibold">Status:</label>
                <select
                  value={selectedIssue.status}
                  onChange={(e) => updateStatus(selectedIssue._id, e.target.value)}
                  className="ml-2 border px-3 py-1 rounded focus:outline-none focus:ring focus:border-indigo-300"
                  disabled={updating || selectedIssue.status === "Resolved"}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                {updating && (
                  <span className="ml-3 text-sm text-blue-500 animate-pulse">
                    Updating...
                  </span>
                )}
              </div>
            </div>
            <button
              className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full"
              onClick={() => setSelectedIssue(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
