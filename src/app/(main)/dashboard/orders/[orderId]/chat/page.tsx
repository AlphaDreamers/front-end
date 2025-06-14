// app/orders/[orderId]/chat/page.tsx

import { redirect } from "next/navigation";
import { getChatByOrderId } from "@/lib/actions/chat";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatContainer } from "@/components/chat/chat-container";
import { auth } from "@/lib/auth";

interface ChatPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { orderId } = await params;
  const session = await auth();

  if (!session) {
    redirect(
      `/sign-in?callback-url=${encodeURIComponent(`/dashboard/orders/${orderId}/chat`)}`
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
        <ChatContainer orderId={orderId} />
      </ChatProvider>
    </div>
  );
}
