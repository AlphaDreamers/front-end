// types.ts

export interface Country {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  surname: string;
  country_id: string;
  email: string;
  password: string;
  verified: boolean;
  created_at: string; // ISO date string
  wallet_created: boolean;
  wallet_created_at: string | null;
  avatar: string | null;
  username: string;
}

export type OrderStatus =
  | "pending"
  | "completed"
  | "in-progress"
  | "awaiting-payment"
  | "pending-delivery";

export interface Order {
  id: string;
  title: string;
  price: number;
  status: OrderStatus;
  created_at: string;
  buyer_id: string;
  seller_id: string;
  deadline?: string;
}

export interface Chat {
  id: string;
  created_at: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_id: string | null;
}

export interface Message {
  id: string;
  chat_id: string;
  text: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
}
