import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const client = await clientPromise;
    const db = client.db("japymenu");
    const collection = db.collection("menu");

    const query = type ? { type } : {};
    const result = await collection.find(query).toArray();

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
