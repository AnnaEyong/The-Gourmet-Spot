"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, serverTimestamp, getDocs } from "firebase/firestore";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import LogoutButton from "@/components/LogoutButton";

export default function KitchenPage() {
  const router = useRouter();
  const auth = getAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData.filter(order => order.status !== "Completed")); // only active orders
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const updateData = { status: newStatus };

      // Set completedAt if status is Completed
      if (newStatus === "Completed") {
        updateData.completedAt = serverTimestamp();
      }

      await updateDoc(orderRef, updateData);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status.");
    }
  };

  const clearAllOrders = () => {
    if (!confirm("Are you sure you want to clear all orders?")) return;

    // Optimistically remove all orders from dashboard
    setOrders([]);
  };
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        router.push("/login"); // redirect to your login page
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Failed to log out.");
      }
    };

  return (
    <ProtectedRoute allowedRoles={['kitchen', 'admin']}>
    <main className="container mx-auto py-6 px-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Kitchen Dashboard</h1>
        <div className="flex gap-2">
            <Link
              href="/archive"
              className="cursor-pointer transition ease-in-out duration-300 hover:bg-gray-500 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300"
            >
              Archives
            </Link>

            {/* <button
              onClick={clearAllOrders}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow"
            >
              Clear All Orders
            </button> */}

            <LogoutButton onLogout={handleLogout} />
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No active orders.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => {
            const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
             const totalPrepTime = order.items.reduce(
              (sum, item) => sum + item.prepTime * item.qty,
              0
            );

            return (
              <div key={order.id} className="bg-white shadow-lg rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Table {order.tableNumber}</h2>
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    order.status === "Pending" ? "bg-gray-200 text-gray-800" :
                    order.status === "Preparing" ? "bg-yellow-300 text-yellow-900" :
                    order.status === "Ready" ? "bg-green-300 text-green-900" :
                    "bg-gray-400 text-white"
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="mb-2 text-sm text-gray-600">
                  <p className="text-blue-600">Placed At: {order.createdAt?.toDate().toLocaleString()}</p>
                  {order.completedAt && <p className="text-green-500">Completed At: {order.completedAt.toDate().toLocaleString()}</p>}
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Price/unit</th>
                      <th className="pb-2">Total</th>
                      <th className="pb-2">PrepTime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.qty}</td>
                        <td className="py-2">${item.price.toFixed(2)}</td>
                        <td className="py-2">${(item.price * item.qty).toFixed(2)}</td>
                        <td className="py-2">{item.prepTime * item.qty} mins</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                      <tr> 
                        <td></td>
                        <td></td>
                        <td className="font-bold py-2 text-left">Total:</td>
                        <td className="font-bold py-2">${totalPrice.toFixed(2)}</td>
                        <td className="font-bold py-2">{totalPrepTime} mins</td>
                      </tr>
                    </tfoot>
                </table>

                <div className="flex gap-2 mt-4">
                  {["Preparing", "Ready", "Completed"].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(order.id, status)}
                      className={`flex-1 px-3 py-2 rounded font-semibold text-sm transition-colors duration-200
                        ${status === "Preparing" ? "bg-yellow-500 text-white hover:bg-yellow-600" : ""}
                        ${status === "Ready" ? "bg-green-500 text-white hover:bg-green-600" : ""}
                        ${status === "Completed" ? "bg-gray-700 text-white hover:bg-gray-800" : ""}
                      `}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
    </ProtectedRoute>
  );
}
