import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/actions";
import { ChatArea } from "@/components/messages/chat-area";

export default async function SingleChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;
  const user = await getCurrentUser();
  if (!user?.isVerified) {
    redirect(`/sign-in?callback-url=/chats/${chatId}`);
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        include: {
          sender: true,
        },
      },
      buyer: true,
      seller: true,
      order: true,
    },
  });

  if (!chat) {
    return notFound();
  }

  if (chat.sellerId !== user.id && chat.buyerId !== user.id) {
    throw new Error("You are not authorized to view this chat");
  }

  return <ChatArea chat={chat} user={user} />;
}
