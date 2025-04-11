import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("orders");

    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      active: true,
      sended: false,
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("orders");

    const result = await collection
      .find({
        active: true,
      })
      .toArray();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
