import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // create a new group conversation
    if (isGroup) {
      const newConversations = await prisma?.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            ...members.map((member: { value: string }) => ({
              id: members.value,
            })),
            id: currentUser.id,
          },
        },
        include: { users: true },
      });

      return NextResponse.json(newConversations);
    }

    // find existing conversations
    const existingConversation = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversation[0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    // create new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            { id: userId },
          ],
        },
      },
      include: { users: true },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
