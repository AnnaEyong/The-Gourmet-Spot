"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await updateProfile(userCred.user, { displayName: form.name });

      alert("Signup successful!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Signup failed: " + err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Kitchen Signup</h1>

        <label className="block mb-3">
          <span className="font-medium">Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            placeholder='John Doe'
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg mt-1 text-sm"
          />
        </label>

        <label className="block mb-3">
          <span className="font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            placeholder='example@gmail.com'
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg mt-1 text-sm"
          />
        </label>

        <label className="block mb-5">
          <span className="font-medium">Password</span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              placeholder='John@1234'
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg mt-1 text-sm"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </label>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </main>
  );
}
