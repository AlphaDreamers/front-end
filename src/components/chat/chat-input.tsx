"use client";

import { SendMessageFormSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "../ui/form";

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

  const onSubmit = onSendMessage;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <input
              {...field}
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 border rounded"
              onFocus={onTypingStart}
              onBlur={onTypingStop}
              onChange={(e) => {
                field.onChange(e);
                onTypingStart();
              }}
            />
          )}
        />
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={(e) => {
            if (e.target.files) {
              form.setValue("attachments", Array.from(e.target.files));
            }
          }}
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </Form>
  );
};

export default ChatInput;
