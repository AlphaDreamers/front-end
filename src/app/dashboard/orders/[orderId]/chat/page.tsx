import { notFound, redirect } from "next/navigation";

import { getChatByOrderId } from "@/lib/actions";
import { me } from "@/lib/actions/auth";
import ChatArea from "@/components/chat/chat-area";

export default async function ChatPage({
  params,
}: {
  params: Promise<{
    orderId: string;
  }>;
}) {
  const { orderId } = await params;

  const user = await me();

  if (!user?.isVerified) {
    redirect(`/sign-in?callback-url=/dashboard/orders/${orderId}/chat`);
  }

  const chat = await getChatByOrderId(orderId);

  if (!chat) {
    return notFound();
  }

  if (chat.seller.id !== user.id && chat.buyer.id !== user.id) {
    throw new Error("Unauthorized access to chat");
  }

  return <ChatArea chat={chat} currentUserId={user.id} />;
}
