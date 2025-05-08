import { Card, CardContent } from "@/components/ui";
import { auth } from "@/hooks/auth";
import { queryAll } from "@/lib/db";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ chatId: string }>;
}>) {
  const { chatId } = await params;

  const userId = await auth();

  const messages = queryAll("SELECT * FROM messages WHERE chat_id = ?", [
    chatId,
  ]) as Message[];

  return (
    <div>
      {messages.map((message) => (
        <Card
          key={message.id}
          className={cn(
            message.sender_id === userId ? "bg-blue-500" : "bg-gray-200"
          )}
        >
          <CardContent></CardContent>
        </Card>
      ))}
    </div>
  );
}
