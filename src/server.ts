import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

import { prisma } from "./lib/prisma";
import { Message } from "./lib/types";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle joining a chat room
    socket.on("join-chat", async ({ chatId, userId }) => {
      try {
        // Verify user has access to this chat
        const chat = await prisma.chat.findFirst({
          where: {
            id: chatId,
            OR: [{ buyerId: userId }, { sellerId: userId }],
          },
        });

        if (!chat) {
          socket.emit("error", "Access denied to this chat");
          return;
        }

        // Join the chat room
        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", "Failed to join chat");
      }
    });

    // Handle sending messages
    socket.on("send-message", async ({ message, chatId }) => {
      try {
        // Step 1: Immediately broadcast to other users in the chat
        const messageWithTimestamp: Message = {
          ...message,
          createdAt: new Date(),
        };
        socket.to(chatId).emit("new-message", messageWithTimestamp);

        // Step 2: Save to database
        const savedMessage = await saveMessageToDatabase(message, chatId);

        // Step 3: Notify all clients (including sender) of successful save
        io.to(chatId).emit("message-saved", {
          tempId: message.id,
          savedMessage,
        });
      } catch (error) {
        console.error("Error processing message:", error);

        // Notify sender of failure
        socket.emit("message-failed", { tempId: message.id });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

async function saveMessageToDatabase(
  message: Omit<Message, "createdAt">,
  chatId: string
): Promise<Message> {
  // Create the message in the database
  const dbMessage = await prisma.message.create({
    data: {
      type: message.mediaUrls.length > 0 ? "MEDIA" : "TEXT",
      status: "SENT", // Map to your Prisma enum
      chatId,

      // Create the appropriate content based on message type
      ...(message.mediaUrls.length > 0
        ? {
            // For media messages
            mediaContent: {
              create: {
                files: {
                  create: message.mediaUrls.map((url) => ({
                    url,
                    type: "IMAGE",
                  })),
                },
                userMessage: {
                  create: {
                    userId: message.senderId,
                  },
                },
              },
            },
          }
        : {
            // For text messages
            textContent: {
              create: {
                text: message.content,
                userMessage: {
                  create: {
                    userId: message.senderId,
                  },
                },
              },
            },
          }),
    },

    // Include the created relations to return complete data
    include: {
      textContent: {
        include: {
          userMessage: true,
        },
      },
      mediaContent: {
        include: {
          files: true,
          userMessage: true,
        },
      },
    },
  });

  return {
    id: dbMessage.id,
    chatId: dbMessage.chatId,
    senderId: message.senderId,
    content: dbMessage.textContent?.text || "",
    mediaUrls: dbMessage.mediaContent?.files.map((f) => f.url) || [],
    status: "sent",
    createdAt: dbMessage.createdAt,
  };
}
