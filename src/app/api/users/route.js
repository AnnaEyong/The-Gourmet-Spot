import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/utils/fileDB";
import bcrypt from "bcryptjs";

export async function GET() {
  const users = readDB("users.json");
  return NextResponse.json(users);
}

export async function POST(req) {
  try {
    const { name, email, password, phone, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const users = readDB("users.json");

    if (users.find(u => u.email === email)) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "kitchen",
    };

    users.push(newUser);
    writeDB("users.json", users);

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
