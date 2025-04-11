import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure the correct path
import { connectToDB } from "@/db";
import Lab from "@/models/labModel";
import { NextResponse } from "next/server";
import Issue from "@/models/issueModel";

export async function PUT(req, { params }) {
    //Update lab details
    try{
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userDept = session.user.department;
        const labId = await params.id; 

        const { labName, totalPCs } = await req.json();

        if (!labName || !totalPCs || totalPCs < 1) {
            return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
        }

        const existingLab = await Lab.findOne({ labName, department: userDept });
        if (existingLab && existingLab._id.toString() !== labId) {
            return NextResponse.json({ error: "Lab already exists in this department" }, { status: 409 });
        }

        const updatedLab = await Lab.findByIdAndUpdate(labId, {
            labName,
            totalPCs,
            workingPCs: totalPCs, 
            faultyPCs: 0 
        }, { new: true });

        if (!updatedLab) {
            return NextResponse.json({ error: "Lab not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, lab: updatedLab }, { status: 200 });
    }
    catch (error) {
        console.error("Error updating lab:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    try{
        await connectToDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userDept = session.user.department;
        const labId = await params.id; 

        
        const lab = await Lab.findById(labId);

        if (!lab) {
            return NextResponse.json({ error: "Lab not found" }, { status: 404 });
        }

        if (lab.department !== userDept) {
            return NextResponse.json({ error: "Unauthorized to delete this lab" }, { status: 403 });
        }
        await Issue.deleteMany({labId: labId});
        await Lab.findByIdAndDelete(labId);

        return NextResponse.json({ success: true, message: "Lab deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.error("Error deleting lab:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}