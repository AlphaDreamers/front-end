"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Send, Paperclip, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { useChatContext } from "./chat-provider";
import { useTypingIndicator } from "@/hooks/use-typing-indicator";
import { formatFileSize } from "@/lib/utils";

export function ChatInput() {
  const { sendMessage, isConnected } = useChatContext();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startTyping, stopTyping } = useTypingIndicator();

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (
      (!trimmedMessage && attachments.length === 0) ||
      !isConnected ||
      isSending
    ) {
      return;
    }

    setIsSending(true);
    try {
      await sendMessage(trimmedMessage, attachments);
      setMessage("");
      setAttachments([]);
      textareaRef.current?.focus();
      stopTyping();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-card">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border-b">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5"
            >
              <Paperclip className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm max-w-[150px] truncate">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 p-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => fileInputRef.current?.click()}
          disabled={!isConnected || isSending}
        >
          <Paperclip className="h-5 w-5" />
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected || isSending}
          className={cn(
            "flex-1 min-h-[40px] max-h-[120px] resize-none",
            "placeholder:text-muted-foreground/60"
          )}
          rows={1}
        />

        <Button
          onClick={handleSend}
          disabled={
            (!message.trim() && attachments.length === 0) ||
            !isConnected ||
            isSending
          }
          size="icon"
          className="h-9 w-9"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
}
