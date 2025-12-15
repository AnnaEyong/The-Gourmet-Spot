"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
      setShowPassword(false);

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
    <main className="flex items-center justify-center min-h-screen bg-cover bg-center bg-white dark:bg-black relative"
      style={{ backgroundImage: "url('/img.jpg')" }}
    >
      
      <div className='absolute backdrop-blur-[1px] w-full h-full flex justify-center items-center z-10'>
      <form onSubmit={handleLogin} className="bg-black/50 border border-white/30 p-8 rounded-xl shadow-2xl text-md w-full max-w-md">
        <h1 className="text-2xl font-medium mb-4 text-white flex justify-center items-center">Login</h1>

        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-black/20 bg-white/30 p-2 rounded-xl w-full mb-4 text-black"
          required
        />

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-black/20 bg-white/30 p-2 rounded-xl w-full mb-4 text-black"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-2 top-2 text-gray-600 dark:text-white"
        >
          {showPassword ? <EyeClosed className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

        <button
          type="submit"
          className={`w-full bg-[#8e0909] text-white px-4 py-2 cursor-pointer rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      </div>
    </main>
  );
}