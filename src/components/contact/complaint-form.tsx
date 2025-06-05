"use client";

import { ComplaintContentSchema } from "@/lib/schemas/contact";
import { KeyValuePair } from "@/lib/types";
import ContactForm from "./contact-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AlertTriangle, ListOrdered } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface ComplaintFormProps {
  isAuth: boolean;
  email?: string;
  orders?: KeyValuePair[];
}

const ComplaintForm = ({ isAuth, email, orders = [] }: ComplaintFormProps) => {
  return (
    <ContactForm
      isAuth={isAuth}
      defaultValues={{
        guestEmail: email,
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
                  You can find this in your order history or confirmation email
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
  );
};

export default ComplaintForm;
