import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb"; // Ajusta la ruta según tengas configurado tu cliente

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("orders");

    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { menuItem } = await request.json();

    if (!menuItem) {
      return NextResponse.json(
        { success: false, message: "Menu item is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("orders");

    const order = await collection.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $push: { elements: menuItem },
      }
    );

    if (updatedOrder.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Failed to update order" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item added to order",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { data } = await request.json();

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Información de la orden es requerida" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("orders");

    const order = await collection.findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          sended: true,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Menu item added to order",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
