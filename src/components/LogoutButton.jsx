"use client";
import useAuth from "@/hooks/useAuth";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="bg-[#8e0909] hover:bg-blue-700 text-white px-4 py-1 rounded-md cursor-pointer  transition-colors duration-200"
    >
      Logout
    </button>
  );
}