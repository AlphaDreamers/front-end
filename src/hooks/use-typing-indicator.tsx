import { useCallback, useRef } from "react";
import { io } from "socket.io-client";

import { useChatContext } from "@/components/chat/chat-provider";

export function useTypingIndicator() {
  const { chatId, currentUser } = useChatContext();
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);
  const socketRef = useRef(io(process.env.NEXT_PUBLIC_SERVER_URL || ""));

  const startTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketRef.current.emit("typing-start", {
      chatId,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  }, [chatId, currentUser]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socketRef.current.emit("typing-stop", {
      chatId,
      userId: currentUser.id,
    });
  }, [chatId, currentUser.id]);

  return { startTyping, stopTyping };
}
