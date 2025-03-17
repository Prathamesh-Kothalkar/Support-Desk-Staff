import { connectToDB } from "@/db";
import bcrypt from "bcryptjs";
import Staff from "@/models/staffModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { staffId, name, email, department, password } = await request.json();

    await connectToDB();

    const existingStaff = await Staff.findOne({ $or: [{ staffId }, { email }] });
    if (existingStaff) {
        return NextResponse.json({ message: "Staff ID or email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
        staffId,
        name,
        department,
        email,
        password: hashedPassword,
    });

    await newStaff.save();

    return NextResponse.json({ message: "Staff registered successfully" });
}
