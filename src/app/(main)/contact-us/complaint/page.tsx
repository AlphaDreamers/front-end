import { AlertTriangle, ListOrdered } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { me } from "@/lib/actions/auth";
import { getKeyValueOrders } from "@/lib/actions/order";
import ContactForm from "@/components/contact/contact-form";
import ContactPageTemplate from "@/components/contact/contact-page-template";
import { ComplaintContentSchema } from "@/lib/schemas/contact";

export default async function ContactPage() {
  const user = await me();
  const isAuth = !!user;

  const orders = user?.id
    ? await getKeyValueOrders({
        where: {
          OR: [{ buyerId: user.id }, { sellerId: user.id }],
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <ContactPageTemplate
      title="File a Complaint"
      description="If you have a complaint regarding a transaction or user behavior, please fill out the form below. Our team will review your complaint and take appropriate action."
    >
      <ContactForm
        isAuth={isAuth}
        defaultValues={{
          guestEmail: user?.email || undefined,
        }}
        schema={ComplaintContentSchema}
      >
        {(form) => (
          <>
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <ListOrdered className="size-4" />
                    Order
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an order" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {orders?.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.title}
                        </SelectItem>
                      )) || (
                        <SelectItem value="" disabled>
                          No orders found
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    You can find this in your order history or confirmation
                    email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AlertTriangle className="size-4" />
                    Issue Description
                    <span className="text-xs text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Please describe the issue in detail..."
                      rows={5}
                      className="h-[100px] resize-none"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible to help us resolve your
                    issue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </ContactForm>
    </ContactPageTemplate>
  );
}
