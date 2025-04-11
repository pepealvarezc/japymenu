import { NextResponse, NextRequest } from "next/server";

type ContextParams = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, context: ContextParams) {
  try {
    const { id } = context.params;

    console.log("IMPRESION", id);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
