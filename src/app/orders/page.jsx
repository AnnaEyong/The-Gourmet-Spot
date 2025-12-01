"use client";
import Header from "@/components/header/Header";
import Navbar from "@/components/navbar/Navbar";
import { useState, useEffect } from "react";

export default function OrderStatusPage() {
     // 🔥 MENU STATE
  const [menuOpen, setMenuOpen] = useState(false);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  if (!order) return <p className="p-4">No active order found.</p>;

  return (
    <main className="container mx-auto p-4">
        <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
    <div className="py-14">
      <h1 className="text-2xl font-bold mb-4">Your Order</h1>

    <div className="flex justify-between  text-lg">
      <p className="mb-2">Table Number: <strong>{order.tableNumber}</strong></p>
      <p className="mb-4">Status: <strong className="text-green-500">{order.status}</strong></p>
    </div>

      <div className="flex flex-col gap-3">
        {order.items.map(item => (
        <div key={item.id} className="grid grid-cols-[1.5fr_2fr_1fr] gap-2 items-center border border-gray-300 rounded-2xl p-2">
            <img 
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover rounded-xl"
        />
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
    <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
    </main>
  );
}
