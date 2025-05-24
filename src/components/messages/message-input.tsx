"use client";

import { Paperclip, Send, X, ImageIcon, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { cn } from "@/lib/utils";

import { SendMessageFormSchema } from "@/lib/schemas";

interface MessageInputProps {
  onSendMessage: (content?: string, attachments?: File[]) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const form = useForm({
    resolver: zodResolver(SendMessageFormSchema),
    defaultValues: {
      text: "",
      attachments: [],
    },
  });

  const onSubmit = (values: z.infer<typeof SendMessageFormSchema>) => {
    onSendMessage(values.text, values.attachments);
    form.reset();
  };

  const getFileIcon = (file: File) => {
    return file.type.startsWith("image/") ? (
      <ImageIcon className="h-4 w-4" />
    ) : (
      <FileText className="h-4 w-4" />
    );
  };

  const removeFile = (index: number) => {
    const currentAttachments = form.getValues("attachments") ?? [];
    const updatedAttachments = [
      ...currentAttachments.slice(0, index),
      ...currentAttachments.slice(index + 1),
    ];
    form.setValue("attachments", updatedAttachments);
  };

  // Function to handle file addition
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const currentAttachments = form.getValues("attachments") ?? [];
      const newAttachments = [
        ...currentAttachments,
        ...Array.from(event.target.files),
      ];
      form.setValue("attachments", newAttachments);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        {/* Attachment preview section */}
        <FormField
          control={form.control}
          name="attachments"
          render={({ field }) => (
            <>
              {field.value && field.value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {field.value.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-muted p-2 rounded text-xs"
                    >
                      {getFileIcon(file)}
                      <span className="truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        type="button"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        />

        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="attachments"
            render={() => (
              <FormItem>
                <FormControl>
                  <div
                    className={cn(
                      "relative",
                      buttonVariants({ variant: "ghost", size: "icon" })
                    )}
                  >
                    <input
                      type="file"
                      className="absolute opacity-0 inset-0 cursor-pointer"
                      onChange={handleFileChange}
                      multiple
                    />
                    <Paperclip className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-5 pointer-events-none" />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1 m-0">
                <FormControl>
                  <Input placeholder="Type a message..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <Button size="icon" type="submit">
            <Send className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
