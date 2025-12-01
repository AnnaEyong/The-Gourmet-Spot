"use client";
import Header from "@/components/header/Header";
import CartCard from "@/components/menuCard/CartCard";
import Navbar from "@/components/navbar/Navbar";
import { useStoreCart } from "@/store/cart.store";
import { Dishes } from "@/utils/data";
import { useState } from "react";
import { useRouter } from "next/navigation"; // for redirect

export default function CartPage() {
  // 🔥 MENU STATE
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

  const handlePlaceOrder = () => {
    if (!tableNumber) {
      alert("Please enter your table number before placing the order.");
      return;
    }

    // Build order items with quantities
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
      id: Date.now().toString(), // unique ID
      tableNumber,
      items: orderItems,
      totalPrice,
      totalPrepTime,
      status: "Pending",
    };

    // Save order to localStorage
    localStorage.setItem("currentOrder", JSON.stringify(order));

    // Clear cart and table number
    clearAll();
    setTableNumber("");

    // Redirect to order page
    router.push("/orders"); // change route if your order page is different
  };

  return (
    <main className="container mx-auto p-4 h-fit bg-white">
      <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <div className="py-14">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <CartCard key={item.id} dish={item} />
            ))}

            {/* Table Number Input */}
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

            {/* Totals & Place Order */}
            <div className="mt-4 border-t border-gray-300 pt-4 flex justify-between items-center">
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
        )}
      </div>
      <Navbar menuOpen={menuOpen} onCloseMenu={() => setMenuOpen(false)} />
    </main>
  );
}
