"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

export default function ArchivePage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "==", "Completed"),
      orderBy("completedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const archiveOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(archiveOrders);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="container mx-auto py-6 px-10 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Archived Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No archived orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => {
            const totalPrice = order.items.reduce(
              (sum, item) => sum + item.price * item.qty,
              0
            );

            return (
              <div key={order.id} className="bg-white shadow-lg rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Table {order.tableNumber}</h2>
                  <span className="px-3 py-1 bg-gray-400 text-white rounded-full font-medium">
                    Completed
                  </span>
                </div>

                <div className="mb-3 text-sm text-gray-600">
                  <p>Placed: {order.createdAt?.toDate().toLocaleString()}</p>
                  <p>Completed: {order.completedAt?.toDate().toLocaleString()}</p>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Price</th>
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
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
