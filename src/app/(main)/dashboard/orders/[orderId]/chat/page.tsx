import { redirect } from "next/navigation";
import { getChatByOrderId } from "@/lib/actions/chat";
import { ChatProvider } from "@/components/chat/chat-provider";
import { ChatContainer } from "@/components/chat/chat-container";
import { auth } from "@/lib/auth";
import PageTemplate from "@/components/templates/page-template";
import UserDetails from "@/components/user-details";

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
    <PageTemplate
      title={`Chat - Order #${orderId}`}
      description={`Chat with the buyer or seller regarding your order`}
      className="h-full flex flex-col"
      actionComponent={<UserDetails user={chatData.otherUser} />}
    >
      <ChatProvider
        chatId={chatData.id}
        currentUserId={chatData.currentUserId}
        otherUser={chatData.otherUser}
        initialMessages={chatData.messages}
      >
        <ChatContainer />
      </ChatProvider>
    </PageTemplate>
  );
}
