import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure the correct path
import { connectToDB } from "@/db";
import Lab from "@/models/labModel";

export async function POST(req) {
    try {
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const userDept = session.user.department;

        const { labName, totalPCs } = await req.json();

        if (!labName || !totalPCs || totalPCs < 1) {
            return new Response(JSON.stringify({ error: "Invalid input data" }), { status: 400 });
        }

        const existingLab = await Lab.findOne({ labName, department: userDept });
        if (existingLab) {
            return new Response(JSON.stringify({ error: "Lab already exists in this department" }), { status: 409 });
        }

        const newLab = new Lab({
            labName,
            department: userDept,
            totalPCs,
            workingPCs: totalPCs, // Initially, all PCs are working
            faultyPCs: 0
        });

        await newLab.save();

        return new Response(JSON.stringify({ success: true, lab: newLab }), { status: 201 });

    } catch (error) {
        console.error("Error adding lab:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
