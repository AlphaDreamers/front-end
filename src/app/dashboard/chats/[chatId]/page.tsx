import { notFound, redirect } from "next/navigation";

import ChatArea from "./chat-area";
import { getChatById, me } from "@/lib/actions";

export default async function ChatPage({
  params,
}: {
  params: Promise<{
    chatId: string;
  }>;
}) {
  const { chatId } = await params;

  const user = await me();

  if (!user?.isVerified) {
    redirect(`/sign-in?callback-url=/dashboard/chats/${chatId}`);
  }

  const chat = await getChatById(chatId);

  if (!chat) {
    return notFound();
  }

  if (chat.seller.id !== user.id && chat.buyer.id !== user.id) {
    throw new Error("Unauthorized access to chat");
  }

  return <ChatArea chat={chat} currentUserId={user.id} />;
}
