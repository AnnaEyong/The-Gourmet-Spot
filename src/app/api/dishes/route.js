import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "dishes.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const dishes = JSON.parse(jsonData);
    return NextResponse.json(dishes);
  } catch (err) {
    console.error("Error reading dishes.json:", err);
    return NextResponse.json({ error: "Failed to load dishes" }, { status: 500 });
  }
}
