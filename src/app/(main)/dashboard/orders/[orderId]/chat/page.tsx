// app/orders/[orderId]/chat/page.tsx

import { redirect } from "next/navigation";
import { getChatByOrderId } from "@/lib/actions/chat";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatContainer } from "@/components/chat/chat-container";
import { me } from "@/lib/actions/auth";

interface ChatPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { orderId } = await params;
  const { user, error } = await me();

  if (!user?.isVerified) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/orders/${orderId}/chat`)}&error=${encodeURIComponent(
        error === "INVALID_TOKEN"
          ? "Invalid token. Please log in again"
          : error === "TOKEN_EXPIRED"
            ? "Your session has expired. Please log in again"
            : "You must be logged in to access this page"
      )}`
    );
  }

  // Fetch chat data server-side
  const chatData = await getChatByOrderId(orderId);

  if (!chatData) {
    redirect("/dashboard");
  }

  return (
    <div className="h-screen flex flex-col">
      <ChatProvider
        chatId={chatData.id}
        currentUserId={chatData.currentUserId}
        otherUser={chatData.otherUser}
        initialMessages={chatData.messages}
      >
        <ChatContainer orderId={params.orderId} />
      </ChatProvider>
    </div>
  );
}
