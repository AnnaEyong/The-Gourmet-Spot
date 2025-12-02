"use client";
import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";
import { useState, useEffect } from "react";

export default function OrderStatusPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");

    // Filter out completed orders
    const activeOrders = savedOrders.filter(order => order.status !== "Completed");
    setOrders(activeOrders);

    // Update storage to remove completed orders
    localStorage.setItem("customerOrders", JSON.stringify(activeOrders));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const refresh = () => loadOrders();
    window.addEventListener("storage", refresh);
    window.addEventListener("customer-orders-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("customer-orders-updated", refresh);
    };
  }, []);

  if (orders.length === 0)
    return (
      <main className="container mx-auto p-4">
        <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="py-14 text-center">
          <h1 className="text-2xl font-bold mb-4">No Active Orders</h1>
          <p className="text-gray-600">You currently have no ongoing orders.</p>
        </div>
        <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
      </main>
    );

  return (
    <main className="container mx-auto p-4">
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />

      <div className="py-14 flex flex-col gap-8">
        <h1 className="text-2xl font-bold -mb-4">Your Orders</h1>
        {orders.map(order => (
          <div key={order.id} className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between text-lg mb-4">
              <p>Table Number: <strong>{order.tableNumber}</strong></p>
              <p>Status: <strong className={
                order.status === "Ready" ? "text-green-500" :
                order.status === "Preparing" ? "text-yellow-500" :
                "text-gray-500"
              }>{order.status}</strong></p>
            </div>

            <div className="flex flex-col gap-2">
              {order.items.map(item => (
                <div key={item.id} className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border border-gray-200 rounded-xl p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-500">{item.qty}x</p>
                  </div>
                  <div>
                    <p>${item.price.toFixed(2)}</p>
                    <p>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-300 pt-4">
              <p className="font-bold">Total Price: ${order.totalPrice.toFixed(2)}</p>
              <p className="font-medium text-gray-600">Total Prep Time: {order.totalPrepTime} mins</p>
            </div>
          </div>
        ))}
      </div>

      <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
    </main>
  );
}
