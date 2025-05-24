"use client";

import { ConversationItem } from "./conversation-item";
import { Prisma } from "@prisma/client";
import SearchBar from "../search-bar";
import FilterCard from "../filter-card";

interface ConversationListProps {
  chats: Prisma.ChatGetPayload<{
    include: {
      messages: true;
      seller: true;
      buyer: true;
      order: true;
    };
  }>[];
  query?: string;
}

export function ConversationList({ chats, query }: ConversationListProps) {
  return (
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
          chats.map((chat) => <ConversationItem chat={chat} key={chat.id} />)
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
  );
}
