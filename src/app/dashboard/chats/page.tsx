import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { File, ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Prisma } from "@prisma/client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import FilterCard from "@/components/filter-card";
import SearchBar from "@/components/search-bar";
import { me } from "@/lib/actions";

export default async function ChatsPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    filter?: string;
    sort?: string;
    role?: string;
  }>;
}) {
  const user = await me();
  if (!user?.isVerified) {
    redirect("/sign-in?callback-url=/chats");
  }

  const { query, filter, sort, role } = await searchParams;

  const chats = await prisma.chat.findMany({
    where: {
      ...(role === "buyer"
        ? { buyerId: user.id }
        : role === "seller"
          ? { sellerId: user.id }
          : {
              OR: [{ buyerId: user.id }, { sellerId: user.id }],
            }),
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
      seller: true,
      buyer: true,
      order: true,
    },
    orderBy: {},
  });

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full md:w-80 lg:w-96 h-full md:border-r border-border">
        <div className="flex flex-col h-full bg-background border-r border-border">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold mb-4">Messages</h2>
            <SearchBar className="mb-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {chats.length} conversation
                {chats.length !== 1 ? "s" : ""}
              </span>
              <FilterCard
                config={[
                  {
                    id: "filter",
                    type: "radio",
                    label: "filter",
                    options: [
                      { label: "All", value: "all" },
                      { label: "Unread", value: "unread" },
                      { label: "Recent", value: "recent" },
                    ],
                  },
                  {
                    id: "sort",
                    label: "Sort by",
                    type: "radio",
                    options: [
                      { label: "Date", value: "date" },
                      { label: "Name", value: "name" },
                      { label: "Unread", value: "unread" },
                    ],
                  },
                  {
                    id: "role",
                    label: "Role",
                    type: "radio",
                    options: [
                      { label: "All", value: "all" },
                      { label: "Buyer", value: "buyer" },
                      { label: "Seller", value: "seller" },
                    ],
                  },
                ]}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length > 0 ? (
              chats.map((chat) => {
                const contact =
                  chat.buyerId === user?.id ? chat.seller : chat.buyer;

                const [lastMessage] = chat.messages;

                const unreadCount = chat.messages.reduce(
                  (count, message) =>
                    message.isRead === false && message.senderId !== user?.id
                      ? count + 1
                      : count,
                  0
                );

                return (
                  <Link
                    key={chat.id}
                    href={`/dashboard/chats/${chat.id}`}
                    className={cn(
                      "flex items-start gap-3 px-4 py-6 transition-all hover:bg-muted/50 hover:border-l-4 hover:border-primary"
                    )}
                  >
                    <Image
                      src={contact.avatar || "/placeholder.svg"}
                      alt={contact.username}
                      width={40}
                      height={40}
                      className="object-cover rounded-full size-10"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {contact.username}
                          </span>
                          {contact.isVerified && (
                            <Badge
                              variant="outline"
                              className="text-chart-2 border-chart-2/50 bg-chart-2/25"
                            >
                              Verified
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {lastMessage
                            ? formatDistanceToNow(lastMessage?.createdAt, {
                                addSuffix: true,
                              })
                            : "No messages yet"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                          {lastMessage?.type === "TEXT" ? (
                            ((lastMessage?.content as Prisma.JsonObject)[
                              "text"
                            ] as string)
                          ) : lastMessage?.type === "IMAGES" ? (
                            <ImageIcon className="size-4" />
                          ) : lastMessage?.type === "FILES" ? (
                            <File className="size-4" />
                          ) : (
                            "Started a conversation"
                          )}
                        </p>

                        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-muted-foreground">No conversations found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {query
                    ? "Try a different search term"
                    : "Start a new conversation"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
