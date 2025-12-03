"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);

  // inside component:
useEffect(() => {
  const unsub = onAuthStateChanged(auth, user => {
    if (!user) window.location.href = "/login";
  });
  return () => unsub();
}, []);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  return (
    <main className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Kitchen Dashboard</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map(order => {
            const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
            return (
              <div key={order.id} className="bg-white shadow-lg rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Table {order.tableNumber}</h2>
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    order.status === "Pending" ? "bg-gray-200 text-gray-800" :
                    order.status === "Preparing" ? "bg-yellow-300 text-yellow-900" :
                    order.status === "Ready" ? "bg-green-300 text-green-900" :
                    "bg-gray-400 text-white"
                  }`}>{order.status}</span>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Price/unit</th>
                      <th className="pb-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="border-b border-gray-200">
                        <td className="py-2">{item.name}</td>
                        <td className="py-2">{item.qty}</td>
                        <td className="py-2">${item.price.toFixed(2)}</td>
                        <td className="py-2">${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="font-bold text-right py-2">Total:</td>
                      <td className="font-bold py-2">${totalPrice.toFixed(2)}</td>
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
                        ${status === "Completed" ? "bg-gray-700 text-white hover:bg-gray-800" : ""}`}
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
  );
}
