import Issue from "@/models/issueModel";
import Lab from "@/models/labModel";
import { getServerSession } from "next-auth"; 
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDB } from "@/db";

export async function PUT(req, { params }) {
    try {
        await connectToDB();
        const { id } = await params;
        const { status } = await req.json();

        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

       
        const issue = await Issue.findById(id);
        if (!issue) {
            return Response.json({ error: "Issue not found" }, { status: 404 });
        }

        const { pcNumber, labId } = issue;

        
        issue.status = status;
        await issue.save();

    
        if (status === "Resolved") {
            const activeIssues = await Issue.find({
                pcNumber,
                labId,
                status: { $ne: "Resolved" }  // Find all non-resolved issues for this PC
            });

           
            if (activeIssues.length === 0) {
                const lab = await Lab.findById(labId);
                if (lab) {
                    lab.workingPCs += 1;
                    lab.faultyPCs -= 1;
                    await lab.save();
                }
            }
        }

        return Response.json({ success: true, issue }, { status: 200 });

    } catch (error) {
        console.error("Error updating issue:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
