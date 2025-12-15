"use client";
import Header from "@/components/header/Header";
import CartCard from "@/components/menuCard/CartCard";
import Navbar from "@/components/navbar/Navbar";
import { useStoreCart } from "@/store/cart.store";
import { Dishes } from "@/utils/data";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Frown } from "lucide-react";

export default function CartPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const { selectedAddedIds, quantities, clearAll } = useStoreCart();
  const router = useRouter();

    useEffect(() => {
    const storedTable = localStorage.getItem("tableNumber");
    if (storedTable) {
      setTableNumber(storedTable);
    }
  }, []);


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
      alert("Please scan the QR code on your table to order.");
      return;
    }
    // Please enter your table number before placing the order.

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
          <div className="h-screen fixed top-0 bottom-0 left-0 right-0 flex flex-col gap-3 items-center justify-center text-black dark:text-white">
             <Frown strokeWidth={2} size={150} />
        <p className="flex gap-2 items-center text-lg font-medium">Your cart is empty</p>
      </div>
        ) : (
          <>
          <h1 className="text-xl font-semibold mb-4 pt-3 dark:text-white">Your Cart</h1>
          <div className="flex flex-col gap-4">
            {cartItems.map(item => (
              <CartCard key={item.id} dish={item} />
            ))}

            {/* <div className="mt-4 dark:text-white">
              <label className="block font-semibold mb-1">Table Number:</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="border border-gray-300 dark:border-white/10 p-2 rounded-xl w-full"
                placeholder="Enter your table number"
              />
            </div> */}

            <div className="mt-4 dark:text-white">
              <label className="block font-semibold mb-1">Table Number:</label>
              <input
                type="text"
                value={tableNumber}
                disabled
                className="border border-gray-300 dark:border-white/10 p-2 rounded-xl w-full bg-gray-100 cursor-not-allowed"
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
