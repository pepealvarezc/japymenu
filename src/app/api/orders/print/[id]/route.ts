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
        ? "http://192.168.68.125:3000/print"
        : "http://192.168.68.125:3000/print/bill";
      axios.post(url, {
        table: order?.table,
        number: `M${order.table}-${String(order._id || "")
          .slice(-4)
          .toUpperCase()}`,
        elements: body.elements || [],
      });
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
