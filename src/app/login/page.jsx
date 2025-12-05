"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        alert("User not found.");
        setLoading(false);
        return;
      }

      const role = userDoc.data().role;

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "kitchen") {
        router.push("/kitchenDashboard");
      } else {
        router.push("/"); // fallback, e.g., customer page
      }
    } catch (err) {
      console.error("Login failed:", err);
      switch (err.code) {
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          alert("Incorrect email or password.");
          break;
        case "auth/user-disabled":
          alert("This account has been disabled.");
          break;
        default:
          alert("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100  relative">
      <img src="/image.jpg" alt="Background" className="fixed inset-0 w-full h-full  object-cover z-0" />
      <div className='absolute backdrop-blur-xs w-full h-full flex justify-center items-center z-10'>
      <form onSubmit={handleLogin} className="bg-white/30 backdrop-blur-2xl p-8 rounded-xl shadow-md text-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          required
        />

        <button
          type="submit"
          className={`w-full bg-[#8e0909] text-white px-4 py-2 rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      </div>
    </main>
  );
}