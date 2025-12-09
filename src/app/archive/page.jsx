"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { Plane } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Nav from "@/components/navbar/Nav";

export default function ArchivePage() {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    let q;

    if (selectedDate) {
      // Filter orders for the selected date
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);
      end.setDate(end.getDate() + 1); // include the entire day

      q = query(
        collection(db, "orders"),
        where("status", "==", "Completed"),
        where("completedAt", ">=", Timestamp.fromDate(start)),
        where("completedAt", "<", Timestamp.fromDate(end)),
        orderBy("completedAt", "desc")
      );
    } else {
      // No filter, just show all completed orders
      q = query(
        collection(db, "orders"),
        where("status", "==", "Completed"),
        orderBy("completedAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, snapshot => {
      const archiveOrders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(archiveOrders);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
        <Nav />
    <main className="container mx-auto pb-6 pt-22 px-10 bg-gray-50 dark:bg-black dark:text-white min-h-screen">
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Archived Orders</h1>

      {/* DATE FILTER */}
      <div className="mb-6">
        <label className="mr-2 font-medium text-gray-700 dark:text-white">Filter by date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded cursor-pointer"
        />
        {selectedDate && (
          <button
            onClick={() => setSelectedDate("")}
            className="ml-3 px-3 py-1 bg-gray-200 dark:bg-gray-500 rounded hover:bg-gray-300 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No archived orders for the selected date.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => {
            const totalPrice = order.items.reduce(
                (sum, item) => sum + item.price * item.qty,
                0
            );

            const totalPrepTime = order.items.reduce(
              (sum, item) => sum + item.prepTime * item.qty,
              0
            );

            return (
              <div key={order.id} className="bg-white dark:bg-gray-900 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Table {order.tableNumber}</h2>
                  <span className="px-3 py-1 bg-gray-400 text-white rounded-full font-medium">
                    Completed
                  </span>
                </div>

                <div className="mb-3 text-sm text-gray-600">
                  <p className="text-blue-600">Placed: {order.createdAt?.toDate().toLocaleString()}</p>
                  <p className="text-green-500">Completed: {order.completedAt?.toDate().toLocaleString()}</p>
                </div>

                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Qty</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Total</th>
                      <th className="pb-2">PrepTime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700 text-sm">
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
                        <td className="font-bold text-left py-2">Total:</td>
                        <td className="font-bold py-2">${totalPrice.toFixed(2)}</td>
                        <td className="font-bold py-2">{totalPrepTime} mins</td>
                      </tr>
                    </tfoot>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </main>
    </ProtectedRoute>
  );
}