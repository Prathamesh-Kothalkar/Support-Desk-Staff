import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectToDB } from "@/db";
import { NextResponse } from "next/server";
import Lab from "@/models/labModel";

export async function GET(req, res) {
    try {
        // Establish DB connection
        await connectToDB();

        // Get session details (Authenticated user)
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Extract user's department from session
        const userDept = session.user.department;

        // Fetch all labs belonging to the user's department
        const labs = await Lab.find({ department: userDept });

        return NextResponse.json({ success: true, labs });

    } catch (error) {
        console.error("Error fetching labs:", error);
        return NextResponse.json({ error: "Internal Server Error" });
    }
}
