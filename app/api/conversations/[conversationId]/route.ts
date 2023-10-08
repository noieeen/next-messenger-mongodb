import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request) {
  return NextResponse.json(request);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
  } catch (error) {
    console.log(error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
