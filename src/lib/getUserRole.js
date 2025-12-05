import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserRole(uid) {
  if (!uid) return null;

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().role;
    }

    return null;
  } catch {
    return null;
  }
}