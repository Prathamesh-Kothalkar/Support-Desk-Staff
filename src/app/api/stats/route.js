import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/db";
import { NextResponse } from "next/server";
import Lab from "@/models/labModel";
import Issue from "@/models/issueModel";

export async function GET() {
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userDept = session.user.department;

    // Fetch all issues and labs from the user's department
    const issues = await Issue.find({ department: userDept }).populate("labId");
    const labs = await Lab.find({ department: userDept });

    // Initialize stats
    const statusCount = { Open: 0, "In Progress": 0, Resolved: 0 };
    const issueTypeCount = {};
    const issuesPerLab = {};
    let totalIssues = 0;
    let recentIssues=issues.slice(-5).reverse();

  
    for (const issue of issues) {
      totalIssues++;
      statusCount[issue.status] = (statusCount[issue.status] || 0) + 1;
      issueTypeCount[issue.issueType] = (issueTypeCount[issue.issueType] || 0) + 1
      const labName = issue.labId?.labName || "Unknown Lab";
      issuesPerLab[labName] = (issuesPerLab[labName] || 0) + 1;
    }


    const labStats = labs.map((lab) => ({
      labName: lab.labName,
      totalPCs: lab.totalPCs,
      workingPCs: lab.workingPCs,
      faultyPCs: lab.faultyPCs,
    }));

    return NextResponse.json({
      success: true,
      totalIssues,
      statusCount,
      issueTypeCount,
      issuesPerLab,
      labStats,
      recentIssues,
    }, { status: 200
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}
