"use client";

import { SendMessageFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "../ui/form";
import { Send, File, X, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ChatInputProps {
  onSendMessage: (data: z.infer<typeof SendMessageFormSchema>) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

const ChatInput = ({
  onSendMessage,
  onTypingStart,
  onTypingStop,
}: ChatInputProps) => {
  const form = useForm({
    resolver: zodResolver(SendMessageFormSchema),
    defaultValues: {
      attachments: [],
      text: "",
    },
  });

  const handleSubmit = onSendMessage;

  const attachments = form.watch("attachments") || [];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col bg-secondary border-t -mx-4 -mb-8"
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 mt-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 text-sm"
              >
                <File className="size-4" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    attachments.splice(index, 1);
                    form.setValue("attachments", attachments);
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <Button
                  variant="outline"
                  type="button"
                  size="icon"
                  className="relative size-10 rounded-full"
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      field.onChange(
                        e.target.files
                          ? [
                              ...(field.value || []),
                              ...Array.from(e.target.files),
                            ]
                          : field.value || []
                      );
                    }}
                    className="absolute w-full h-full rounded-full opacity-0 cursor-pointer"
                  />

                  <Plus className="size-5" />
                </Button>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Type a message..."
                  className="flex-1 overflow-y-auto"
                  onFocus={onTypingStart}
                  onBlur={onTypingStop}
                  onChange={(e) => {
                    field.onChange(e);
                    if (e.target.value) onTypingStart();
                    else onTypingStop();
                  }}
                />
              )}
            />

            <Button type="submit" size="icon" className="size-10 rounded-full">
              <Send className="size-5 mr-0.5 mt-0.5" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChatInput;
