"use client";
import Header from "@/components/header/Header";
import CartCard from "@/components/menuCard/CartCard";
import Navbar from "@/components/navbar/Navbar";
import { useStoreCart } from "@/store/cart.store";
import { Dishes } from "@/utils/data";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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

  // Generate or retrieve anonymous customerId
  const [customerId, setCustomerId] = useState("");
  useEffect(() => {
    let storedId = localStorage.getItem("customerId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("customerId", storedId);
    }
    setCustomerId(storedId);
  }, []);

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      alert("Please enter your table number before placing the order.");
      return;
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

    try {
      await addDoc(collection(db, "orders"), {
        tableNumber,
        items: orderItems,
        totalPrice,
        totalPrepTime,
        status: "Pending",
        customerId,
        createdAt: serverTimestamp()
      });

      clearAll();
      setTableNumber("");
      router.push("/orders");
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <main className="container mx-auto p-4 h-fit bg-white">
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <div className="py-14">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {cartItems.length === 0 ? (
          <p className="">Your cart is empty</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map(item => <CartCard key={item.id} dish={item} />)}
            <div className="mt-4">
              <label className="block font-semibold mb-1">Table Number:</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="border border-gray-300 p-2 rounded-xl w-full"
                placeholder="Enter your table number"
              />
            </div>
            <div className="mt-4 border-t border-gray-300 pt-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">Total Price: ${totalPrice.toFixed(2)}</p>
                <p className="font-medium text-gray-600">Total Prep Time: {totalPrepTime} mins</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="bg-[#8e0909] text-white px-6 py-2 rounded font-semibold"
              >
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
      <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
    </main>
  );
}
