// app/orders/[orderId]/chat/page.tsx

import { redirect } from "next/navigation";
import { getChatByOrderId } from "@/lib/actions/chat";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatContainer } from "@/components/chat/chat-container";

interface ChatPageProps {
  params: {
    orderId: string;
  };
}

export default async function ChatPage({ params }: ChatPageProps) {
  // Fetch chat data server-side
  const chatData = await getChatByOrderId(params.orderId);

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
