import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export function readDB(fileName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content || "[]");
}

export function writeDB(fileName, data) {
  const filePath = path.join(dataDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}
