import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/utils/fileDB";

export async function GET() {
  return NextResponse.json(readDB("categories.json"));
}

export async function POST(req) {
  const { name } = await req.json();
  const categories = readDB("categories.json");

  const newCategory = { id: Date.now().toString(), name };
  categories.push(newCategory);
  writeDB("categories.json", categories);

  return NextResponse.json(newCategory);
}
