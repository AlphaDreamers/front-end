import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { type Message } from "./lib/types.js";
import { prisma } from "./lib/prisma";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`
  );

  const io = new Server(server);
  io.on("connection", (socket) => {
    console.log("FLAG 1 - from server (client connected)");

    socket.on(SocketEvent.JOIN_ROOM, ({ chatId }) => {
      console.log("FLAG 2 - server joining room", chatId);
      socket.join(chatId);
      socket.emit(SocketEvent.JOIN_ROOM, { chatId }); // Notify client
    });

    socket.on(SocketEvent.LEAVE_ROOM, ({ chatId }) => {
      console.log("FLAG 3 - server leaving room", chatId);
      socket.leave(chatId);
    });

    socket.on(
      SocketEvent.MESSAGE,
      async ({ chatId, messages }: { chatId: string; messages: Message[] }) => {
        try {
          // Add chatId to each message for database storage
          const messagesWithChatId = messages.map((msg) => ({
            ...msg,
            chatId,
            id: msg.id || Date.now().toString(), // Ensure unique ID
          }));

          // Store messages in the database (using Prisma as assumed from your model)
          const storedMessages: Message[] = await Promise.all(
            messagesWithChatId.map((msg) =>
              prisma.message.create({
                data: {
                  chatId: msg.chatId,
                  senderId: msg.senderId,
                  content: {
                    toJSON: () => msg.content,
                  },
                  type: msg.type,
                },
                select: {
                  id: true,
                  senderId: true,
                  content: true,
                  type: true,
                  createdAt: true,
                  sender: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      password: true,
                      isVerified: true,
                      avatar: true,
                    },
                  },
                },
              })
            )
          );

          // Broadcast to all clients in the chat room
          io.to(chatId).emit(SocketEvent.MESSAGE, storedMessages);

          // Send acknowledgment to the sender
          socket.emit(SocketEvent.MESSAGE_ACK, {
            chatId,
            messageIds: storedMessages.map((m) => m.id),
          });
        } catch (error) {
          console.error("Error processing message:", error);
          socket.emit(SocketEvent.MESSAGE_ERROR, {
            chatId,
            error: "Failed to send message",
          });
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("FLAG 5 - from server (client disconnected)");
    });
  });
  server.listen(port);
});

const SocketEvent = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  JOIN_ROOM: "join-room",
  LEAVE_ROOM: "leave-room",
  MESSAGE: "chat-message",
  ERROR: "error",
  MESSAGE_ACK: "message-ack",
  MESSAGE_ERROR: "message-error",
} as const;

type SocketEvent = (typeof SocketEvent)[keyof typeof SocketEvent];
