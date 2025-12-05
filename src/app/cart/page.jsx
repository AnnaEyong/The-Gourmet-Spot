"use client";
import Header from "@/components/header/Header";
import CartCard from "@/components/menuCard/CartCard";
import Navbar from "@/components/navbar/Navbar";
import { useStoreCart } from "@/store/cart.store";
import { Dishes } from "@/utils/data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const { selectedAddedIds, quantities, clearAll } = useStoreCart();
  const router = useRouter();

  const cartItems = Dishes.filter(dish => selectedAddedIds.includes(dish.id));

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 1),
    0
  );

  const totalPrepTime = cartItems.reduce(
    (sum, item) => sum + item.prepTime * (quantities[item.id] || 1),
    0
  );

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      alert("Please enter your table number before placing the order.");
      return;
    }

    // Generate customerId if not already present
    let customerId = localStorage.getItem("customerId");
    if (!customerId) {
      customerId = Date.now().toString();
      localStorage.setItem("customerId", customerId);
    }

    const orderItems = cartItems.map(dish => ({
      id: dish.id,
      image: dish.image,
      name: dish.name,
      qty: quantities[dish.id] || 1,
      price: dish.price,
      category: dish.category,
      prepTime: dish.prepTime,
    }));

    const order = {
      tableNumber,
      items: orderItems,
      totalPrice,
      totalPrepTime,
      status: "Pending",
      customerId,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "orders"), order);
      clearAll();
      setTableNumber("");
      router.push("/orders"); // redirect to order page
    } catch (err) {
      console.error("Failed to place order:", err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <main className="container mx-auto p-4 h-fit bg-white dark:bg-black min-h-screen">
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <div className="py-14">

        {cartItems.length === 0 ? (
          <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold mb-4">Your Cart</h1>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
        ) : (
          <>
          <h1 className="text-xl font-semibold mb-4 pt-3 dark:text-white">Your Cart</h1>
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <CartCard key={item.id} dish={item} />
            ))}

            <div className="mt-4 dark:text-white">
              <label className="block font-semibold mb-1">Table Number:</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="border border-gray-300 dark:border-white/10 p-2 rounded-xl w-full"
                placeholder="Enter your table number"
              />
            </div>

            <div className="mt-4 border-t border-gray-300 dark:border-white/10 dark:text-white pt-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">Total Price: ${totalPrice.toFixed(2)}</p>
                <p className="font-medium text-gray-600">
                  Total Prep Time: {totalPrepTime} mins
                </p>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="bg-[#8e0909] text-white px-6 py-2 rounded font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
          </>
        )}
      </div>
      <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
    </main>
  );
}
