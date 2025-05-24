export const SocketEvent = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  MESSAGE: "chat-message",
  ERROR: "error",
  MESSAGE_ACK: "message-ack",
  MESSAGE_ERROR: "message-error",
} as const;

export type SocketEvent = (typeof SocketEvent)[keyof typeof SocketEvent];
