"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";

export default function InitAuth() {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth).catch(err =>
          console.error("Anonymous auth failed:", err)
        );
      }
    });

    return () => unsub();
  }, []);

  return null;
}
