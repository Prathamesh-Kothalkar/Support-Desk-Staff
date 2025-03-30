import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/db";
import { NextResponse } from "next/server";
import Lab from "@/models/labModel";
import Student from "@/models/student";
import Issue from "@/models/issueModel";


export async function GET(res) {
    try {
      
        await connectToDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userDept = session.user.department;
        const issues = await Issue.find({ department: userDept }).populate("labId").populate("reportedBy", "name email zprn phone department");
        
        return NextResponse.json({ success: true, issues });

    } catch (error) {
        console.error("Error fetching labs:", error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}