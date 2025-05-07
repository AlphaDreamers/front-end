"use server";

import { queryAll, queryGet } from "./db";
import { Chat, Message, Order, OrderStatus, User } from "./types";

interface GetConversationsOptions {
  query?: string;
  unreadOnly?: boolean;
  status?: OrderStatus;
  role?: "buyer" | "seller";
  limit: number;
  offset: number;
}

type Conversation = Chat & {
  order: Order;
  messages: Message[];
  buyer: User;
  seller: User;
  last_message: Message | null;
};

export const getConversations = async ({
  query,
  unreadOnly,
  status,
  role,
  limit = 10,
  offset = 0,
}: Partial<GetConversationsOptions>): Promise<Conversation[]> => {
  const filters: string[] = [];
  const params: (string | number)[] = [];

  let baseQuery = `
    SELECT c.*
    FROM chats c
    JOIN orders o ON o.id = c.order_id
  `;

  if (unreadOnly) {
    baseQuery += `
      JOIN messages m ON m.chat_id = c.id
    `;
    filters.push("m.is_read = 0");
  }

  if (query) {
    filters.push("LOWER(o.title) LIKE ?");
    params.push(`%${query.toLowerCase()}%`);
  }

  if (status) {
    filters.push("o.status = ?");
    params.push(status);
  }

  if (role === "buyer") {
    filters.push("c.buyer_id = o.buyer_id");
  } else if (role === "seller") {
    filters.push("c.seller_id = o.seller_id");
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const finalQuery = `${baseQuery} ${whereClause} GROUP BY c.id LIMIT ? OFFSET ?`;
  params.push(limit?.toString(), offset?.toString());

  const chats: Chat[] = queryAll(finalQuery, params) as Chat[];

  const conversations: Conversation[] = chats.map((chat) => {
    const order = queryGet("SELECT * FROM orders WHERE id = ?", [
      chat.order_id,
    ]) as Order;
    const buyer = queryGet("SELECT * FROM users WHERE id = ?", [
      chat.buyer_id,
    ]) as User;
    const seller = queryGet("SELECT * FROM users WHERE id = ?", [
      chat.seller_id,
    ]) as User;
    const messages = queryAll(
      "SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC",
      [chat.id]
    ) as Message[];

    const last_message = chat.last_message_id
      ? (queryGet("SELECT * FROM messages WHERE id = ?", [
          chat.last_message_id,
        ]) as Message)
      : null;

    return {
      ...chat,
      order,
      buyer,
      seller,
      messages,
      last_message,
    };
  });

  return conversations;
};

export const getConversationsCount = async ({
  query,
  unreadOnly,
  status,
  role,
}: Partial<GetConversationsOptions>): Promise<number> => {
  const filters: string[] = [];
  const params: (string | number)[] = [];

  let baseQuery = `
    SELECT COUNT(DISTINCT c.id) as count
    FROM chats c
    JOIN orders o ON o.id = c.order_id
  `;

  if (unreadOnly) {
    baseQuery += `
      JOIN messages m ON m.chat_id = c.id
    `;
    filters.push("m.is_read = 0");
  }

  if (query) {
    filters.push("LOWER(o.title) LIKE ?");
    params.push(`%${query.toLowerCase()}%`);
  }

  if (status) {
    filters.push("o.status = ?");
    params.push(status);
  }

  if (role === "buyer") {
    filters.push("c.buyer_id = o.buyer_id");
  } else if (role === "seller") {
    filters.push("c.seller_id = o.seller_id");
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const finalQuery = `${baseQuery} ${whereClause}`;

  const result = queryGet(finalQuery, params) as { count: number };

  return result.count;
};
