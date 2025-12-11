"use client";
import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, onSnapshot, updateDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
import { Eye, EyeClosed, Trash2 } from "lucide-react";
import Nav from "@/components/navbar/Nav";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // <-- New search state

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "kitchen",
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      alert("Role updated successfully!");
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role.");
    }
    setSaving(false);
  };

  const createUser = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(),
      });

      setNewUser({ name: "", email: "", password: "", role: "kitchen" });
      setShowPassword(false);

      alert("User created successfully!");
      setSaving(false);
    } catch (err) {
      console.error("Failed to create user:", err);
      alert("Failed to create user: " + err.message);
      setSaving(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user.");
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
        <Nav />
      <main className="bg-white dark:bg-black">
      <section className="container mx-auto max-w-4xl pb-6 pt-20">
        <div className="flex justify-between items-center mb-6 pt-3">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">User Management</h1>
          <div className="flex gap-2">
            <Link
              href="/archive"
              className="cursor-pointer transition ease-in-out duration-300 hover:bg-gray-200 bg-gray-100 text-black dark:text-white dark:bg-gray-600 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
            >
              Archived Orders
            </Link>

          </div>
        </div>

        {/* CREATE USER FORM */}
        <form
          onSubmit={createUser}
          className="mb-8 py-6 px-4 bg-card rounded-xl border border-gray-300 dark:border-white/20 text-black dark:text-white shadow flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
            className="border dark:border-white/20 p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
            className="border dark:border-white/20 p-2 rounded"
          />

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
              className="border dark:border-white/20 p-2 rounded w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-600 dark:text-white"
            >
              {showPassword ? <EyeClosed className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border dark:border-white/20 bg-card cursor-pointer p-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="kitchen">Kitchen Staff</option>
            <option value="customer">Customer</option>
          </select>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#8e0909] text-white cursor-pointer px-4 py-2 rounded font-semibold "
          >
            {saving ? "Creating..." : "Create User"}
          </button>
        </form>


        {/* EXISTING USERS */}
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-semibold text-2xl text-gray-800 dark:text-white">Existing Users</h1>
            {/* SEARCH INPUT */}
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[50%] text-black dark:text-white border dark:border-white/20 py-2 px-4 rounded-xl"
            />
        </div>
            <div className="grid grid-cols-2 gap-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-4 bg-card dark:text-white rounded-xl border border-gray-300 dark:border-white/20 shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{user.email}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <select
                        defaultValue={user.role}
                        className="border px-3 py-2 rounded bg-card cursor-pointer"
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        disabled={saving}
                      >
                        <option value="admin">Admin</option>
                        <option value="kitchen">Kitchen Staff</option>
                        <option value="customer">Customer</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-700 cursor-pointer px-3 py-1 rounded font-semibold"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
      </main>
    </ProtectedRoute>
  );
}