"use client";

import { Bell, Package, MessageSquare, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { Check, ChevronsUpDown, Loader2, Settings2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

import { UserSettings } from "@/lib/types/settings";
import { SettingsFormSchema } from "@/lib/schemas/settings";
import { updateSettings } from "@/lib/actions/settings";
import { LANGUAGES } from "@/lib/data/languages";
import { TIME_ZONES } from "@/lib/data/time-zones";

interface SettingsFormProps {
  settings: UserSettings;
}

const SettingsForm = ({ settings }: SettingsFormProps) => {
  const form = useForm({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: settings,
  });
  const onSubmit = async (values: z.infer<typeof SettingsFormSchema>) =>
    toast.promise(async () => updateSettings(values), {
      loading: "Saving settings...",
      success: "Settings saved successfully!",
      error: "Failed to save settings. Please try again.",
    });

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="notifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
              <h3 className="mb-4 text-lg font-medium">Language & Region</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Language</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? LANGUAGES.find(
                                    (language) => language.code === field.value
                                  )?.label
                                : "Select language"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search language..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No languages found.</CommandEmpty>
                              <CommandGroup>
                                {LANGUAGES.map((language) => (
                                  <CommandItem
                                    value={language.label}
                                    key={language.code}
                                    onSelect={() => {
                                      form.setValue("language", language.code);
                                    }}
                                  >
                                    {language.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        language.code === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Choose your preferred language for the interface
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Timezone</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? TIME_ZONES.find(
                                    (language) => language.value === field.value
                                  )?.label
                                : "Select timezone"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search timezone..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No timezones found.</CommandEmpty>
                              <CommandGroup>
                                {TIME_ZONES.map((tz) => (
                                  <CommandItem
                                    value={tz.label}
                                    key={tz.value}
                                    onSelect={() => {
                                      form.setValue("timezone", tz.value);
                                    }}
                                  >
                                    {tz.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        tz.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your timezone is used for scheduling and quiet hours
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
              <h3 className="mb-4 text-lg font-medium">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="ordersEnabled"
                  render={({ field }) => (
                    <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <Package className="size-6" />
                            Order notifications
                          </FormLabel>
                          <FormDescription className="ml-8">
                            Updates about your orders, deliveries, and
                            transactions.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>

                      {field.value && (
                        <>
                          <FormField
                            control={form.control}
                            name="ordersEmail"
                            render={({ field: emailField }) => (
                              <FormItem className="flex items-center ml-8">
                                <Checkbox
                                  checked={emailField.value}
                                  onCheckedChange={emailField.onChange}
                                />
                                <FormLabel className="text-sm font-normal">
                                  Email notifications
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="ordersInApp"
                            render={({ field: inAppField }) => (
                              <FormItem className="flex items-center ml-8">
                                <Checkbox
                                  checked={inAppField.value}
                                  onCheckedChange={inAppField.onChange}
                                />
                                <FormLabel className="text-sm font-normal">
                                  In-app notifications
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="messagesEnabled"
                  render={({ field }) => (
                    <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <MessageSquare className="size-6" />
                            Message notifications
                          </FormLabel>
                          <FormDescription className="ml-8">
                            New messages from buyers and sellers.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>

                      {field.value && (
                        <>
                          <FormField
                            control={form.control}
                            name="messagesEmail"
                            render={({ field: emailField }) => (
                              <FormItem className="flex items-center ml-8">
                                <Checkbox
                                  checked={emailField.value}
                                  onCheckedChange={emailField.onChange}
                                />
                                <FormLabel className="text-sm font-normal">
                                  Email notifications
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="messagesInApp"
                            render={({ field: inAppField }) => (
                              <FormItem className="flex items-center ml-8">
                                <Checkbox
                                  checked={inAppField.value}
                                  onCheckedChange={inAppField.onChange}
                                />
                                <FormLabel className="text-sm font-normal">
                                  In-app notifications
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reviewsEnabled"
                  render={({ field }) => (
                    <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
                      <FormItem className="flex flex-row items-center justify-between">
                        <div className="space-y-0.5">
                          <FormLabel>
                            <Star className="size-6" />
                            Review notifications
                          </FormLabel>
                          <FormDescription className="ml-8">
                            New reviews and ratings on your gigs.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>

                      {field.value && (
                        <>
                          <FormField
                            control={form.control}
                            name="reviewsEmail"
                            render={({ field: emailField }) => (
                              <FormItem className="flex items-center ml-8">
                                <Checkbox
                                  checked={emailField.value}
                                  onCheckedChange={emailField.onChange}
                                />
                                <FormLabel className="text-sm font-normal">
                                  Email notifications
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="reviewsInApp"
                            render={({ field: inAppField }) => (
                              <FormItem className="flex items-center ml-8">
                                <Checkbox
                                  checked={inAppField.value}
                                  onCheckedChange={inAppField.onChange}
                                />
                                <FormLabel className="text-sm font-normal">
                                  In-app notifications
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>

            <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
              <h3 className="mb-4 text-lg font-medium">
                Notification Preferences
              </h3>
              <FormField
                control={form.control}
                name="quietHoursEnabled"
                render={({ field }) => (
                  <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>
                          <Bell className="size-6" />
                          Quiet Hours
                        </FormLabel>
                        <FormDescription className="ml-8">
                          Mute notifications during specified hours.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>

                    {field.value && (
                      <div className="flex gap-6">
                        <FormField
                          control={form.control}
                          name="quietHoursStartTime"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value || null;
                                    field.onChange(value);
                                  }}
                                  className="w-full"
                                  placeholder="HH:MM"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="quietHoursEndTime"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value || null;
                                    field.onChange(value);
                                  }}
                                  className="w-full"
                                  placeholder="HH:MM"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
              <h3 className="mb-4 text-lg font-medium">Security Settings</h3>

              {/* Password Change */}
              <div className="rounded-lg border p-4 shadow-sm flex flex-col gap-2">
                <h4 className="font-medium mb-2">Change Password</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you want to change your password, please click the link
                  below. You will be redirected to the password reset page where
                  you can set a new password.
                </p>
                <Link
                  href="/reset-password"
                  className={cn(buttonVariants({ className: "w-fit ml-auto" }))}
                >
                  Click here to reset your password
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Button type="submit" className="mt-4 w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Save Settings
              <Settings2 />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
