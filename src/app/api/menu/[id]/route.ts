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
    const collection = db.collection("menu");

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
