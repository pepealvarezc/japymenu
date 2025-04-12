import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("orders");

    const order = await collection.findOne({ _id: new ObjectId(id) });
    if (order) {
      const url = order.active
        ? "https://0d00-189-128-161-72.ngrok-free.app/print"
        : "https://0d00-189-128-161-72.ngrok-free.app/print/bill";

      axios.post(
        url,
        {
          table: order?.table,
          number: `M${order.table}-${String(order._id || "")
            .slice(-4)
            .toUpperCase()}`,
          elements: body.elements || [],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Order Finished",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
