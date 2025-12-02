"use client";
import { useEffect, useState } from "react";

export default function KitchenPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  }, []);

  useEffect(() => {
  const refreshOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(storedOrders);
  };

  // Listen for new orders
  window.addEventListener("orders-updated", refreshOrders);

  // Listen for updates made on other tabs
  window.addEventListener("storage", refreshOrders);

  return () => {
    window.removeEventListener("orders-updated", refreshOrders);
    window.removeEventListener("storage", refreshOrders);
  };
}, []);


  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Update customerOrders array
    const customerOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");
    const updatedCustomerOrders = customerOrders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem("customerOrders", JSON.stringify(updatedCustomerOrders));

    // Dispatch custom event so customers pages can listen
    window.dispatchEvent(new Event("customer-orders-updated"));
  };

  const clearAllOrders = () => {
    if (confirm("Are you sure you want to clear all orders?")) {
      localStorage.removeItem("orders");
      localStorage.removeItem("customerOrders");
      setOrders([]);
    }
  };

  return (
    <main className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Kitchen Dashboard</h1>
        <button
          onClick={clearAllOrders}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold shadow"
        >
          Clear All Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map(order => {
            const totalPrice = order.items.reduce(
              (sum, item) => sum + item.price * item.qty,
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
  );
}
