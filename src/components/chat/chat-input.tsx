"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { Send, Paperclip, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "./chat-provider";
import { formatFileSize } from "@/lib/utils";

export function ChatInput() {
  const { sendMessage, isConnected } = useChat();
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    // Validate that we have content to send
    if (!trimmedMessage && attachments.length === 0) return;
    if (!isConnected || isSending) return;

    setIsSending(true);

    try {
      await sendMessage(trimmedMessage, attachments);
      // Clear form on success
      setMessage("");
      setAttachments([]);
      textareaRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
      // Keep form data on error so user can retry
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

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate files
    const validFiles = files.filter((file) => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }

      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a supported image type.`);
        return false;
      }

      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
    // Reset input to allow selecting the same file again
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t bg-card">
      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="p-3 border-b">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="relative group bg-muted rounded-lg p-2 pr-8"
              >
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm max-w-[150px] truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({formatFileSize(file.size)})
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 p-3">
        {/* File upload button */}
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
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text input */}
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected || isSending}
          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />

        {/* Send button */}
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
