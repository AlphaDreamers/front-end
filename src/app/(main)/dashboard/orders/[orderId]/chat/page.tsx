import { notFound, redirect } from "next/navigation";

import { getChatByOrderId, getOrderDetails } from "@/lib/actions/chat";
import { me } from "@/lib/actions/auth";
import { ChatContainer } from "@/components/chat/chat-container";
import { ChatProvider } from "@/hooks/use-chat";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const user = await me();

  if (!user?.isVerified) {
    redirect(`/sign-in?callback-url=/dashboard/orders/${orderId}/chat`);
  }

  const [chat, order] = await Promise.all([
    getChatByOrderId(orderId),
    getOrderDetails(orderId),
  ]);

  if (!chat || !order) {
    return notFound();
  }

  // Check if user has access to this chat
  const hasAccess = chat.buyer.id === user.id || chat.seller.id === user.id;
  if (!hasAccess) {
    return notFound();
  }

  return (
    <ChatProvider
      chatId={chat.id}
      initialMessages={chat.messages}
      currentUser={user}
    >
      <div className="h-full flex flex-col bg-background">
        <ChatContainer order={order} />
      </div>
    </ChatProvider>
  );
}
