import { NextResponse } from "next/server";
import { readDB } from "@/utils/fileDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, password } = await req.json();
  const users = readDB("users.json");

  const user = users.find(u => u.email === email);
  if (!user) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ error: "Invalid password" }, { status: 400 });

  if (user.role !== "kitchen") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return NextResponse.json({ token });
}
