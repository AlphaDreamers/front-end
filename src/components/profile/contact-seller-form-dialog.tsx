"use client";

import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ContactSellerFormSchema } from "@/lib/schemas";
import { contactSeller } from "@/lib/actions";

interface ContactSellerFormDialogProps {
  user: Prisma.UserGetPayload<{
    select: {
      id: true;
      firstName: true;
      lastName: true;
    };
  }>;
}

const ContactSellerFormDialog = ({ user }: ContactSellerFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(ContactSellerFormSchema),
    defaultValues: {
      message: "",
      recipientId: user.id,
    },
  });

  const onSubmit = (data: z.infer<typeof ContactSellerFormSchema>) => {
    toast.promise(async () => contactSeller(data), {
      loading: "Sending message...",
      success: () => {
        setIsOpen(false);

        return "Message sent!";
      },
      error: "Failed to send message",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="fixed md:static bottom-12 right-8 rounded-full md:rounded-md md:h-9 md:px-4md: py-2 md:has-[>svg]:px-3"
        >
          <MessageSquare /> Contact
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Contact seller </DialogTitle>
              <DialogDescription>
                Send a message to {user.firstName} {user.lastName}
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="my-4">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent to the seller.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button className="ml-auto" variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Send</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default ContactSellerFormDialog;
