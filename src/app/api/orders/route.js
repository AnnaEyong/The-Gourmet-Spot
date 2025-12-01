import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/utils/fileDB";

// GET all orders
export async function GET() {
  const orders = readDB("orders.json");
  return NextResponse.json(orders);
}

// POST a new order
export async function POST(req) {
  try {
    const { items, tableNumber } = await req.json();
    if (!items || !tableNumber) {
      return NextResponse.json({ error: "Missing items or table number" }, { status: 400 });
    }

    const dishes = readDB("dishes.json");
    const orders = readDB("orders.json");

    let totalPrice = 0;
    let totalPrepTime = 0;

    const orderItems = items.map(item => {
      const dish = dishes.find(d => d.id === item.id);
      if (!dish) throw new Error(`Dish not found: ${item.id}`);
      totalPrice += dish.price * (item.quantity || 1);
      totalPrepTime += (dish.prepTime || 0) * (item.quantity || 1);
      return {
        id: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: item.quantity || 1,
        prepTime: dish.prepTime || 0
      };
    });

    const newOrder = {
      id: Date.now().toString(),
      items: orderItems,
      tableNumber,
      totalPrice,
      totalPrepTime,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    writeDB("orders.json", orders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}

// PUT to update order status (kitchen only)
export async function PUT(req) {
  try {
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const orders = readDB("orders.json");
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    orders[orderIndex].status = status;
    writeDB("orders.json", orders);

    return NextResponse.json(orders[orderIndex]);
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
