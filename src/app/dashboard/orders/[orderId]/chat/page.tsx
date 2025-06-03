import { notFound, redirect } from "next/navigation";

import { getChatByOrderId, getOrderDetails } from "@/lib/actions/chat";
import { me } from "@/lib/actions/auth";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatContainer } from "@/components/chat/chat-container";

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

  // Determine user role in this chat
  const userRole = chat.buyer.id === user.id ? "buyer" : "seller";
  const otherUser = userRole === "buyer" ? chat.seller : chat.buyer;

  return (
    <ChatProvider
      chatId={chat.id}
      orderId={orderId}
      currentUser={{
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        role: userRole,
      }}
      otherUser={otherUser}
      initialMessages={chat.messages}
    >
      <div className="h-full flex flex-col bg-background">
        <ChatContainer order={order} />
      </div>
    </ChatProvider>
  );
}
