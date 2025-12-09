import { Ban } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="p-10 text-center flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black dark:text-white">
      <h1 className="text-9xl font-bold mb-3">403</h1>
      <h1 className="text-3xl font-bold flex gap-2 items-center">Access Denied <Ban strokeWidth={3} color="red"/></h1>
      <p>You do not have permission to view this page.</p>
    </main>
  );
}