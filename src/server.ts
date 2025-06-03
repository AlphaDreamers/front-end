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
    console.log("New client connected:", socket.id);

    socket.on("join-chat", async ({ chatId, userId }) => {
      try {
        // Verify user has access to chat
        const chat = await prisma.chat.findFirst({
          where: {
            id: chatId,
            OR: [{ buyerId: userId }, { sellerId: userId }],
          },
          select: {
            id: true,
          },
        });

        if (!chat) {
          socket.emit("error", "Access denied");
          return;
        }

        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);

        // Mark unread messages as delivered
        await prisma.message.updateMany({
          where: {
            chatId,
            textContent: {
              userMessage: {
                userId: {
                  not: userId,
                },
              },
            },
            NOT: {
              readBy: {
                some: {
                  id: userId,
                },
              },
            },
          },
          data: {
            // This would need a status field in the schema
          },
        });
      } catch (error) {
        console.error("Error joining chat:", error);
        socket.emit("error", "Failed to join chat");
      }
    });

    // Handle sending messages
    socket.on(
      "message",
      async ({ message, chatId }: { message: Message; chatId: string }) => {
        try {
          // Broadcast to other users in the chat immediately
          socket.to(chatId).emit("message", message);

          // Save to database
          const savedMessage = await saveMessage(message, chatId);

          // Emit confirmation with saved message
          io.to(chatId).emit("message-saved", {
            message: savedMessage,
            tempId: message.id,
          });
        } catch (error) {
          console.error("Error saving message:", error);
          socket.emit("message-error", {
            tempId: message.id,
            error: "Failed to save message",
          });
        }
      }
    );

    // Handle typing indicators
    socket.on("typing-start", ({ chatId, userId, userName }) => {
      socket.to(chatId).emit("typing-start", { userId, userName });
    });

    socket.on("typing-stop", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing-stop", { userId });
    });

    // Handle message status updates
    socket.on("message-delivered", async ({ messageId, chatId }) => {
      socket.to(chatId).emit("message-delivered", { messageId });
    });

    socket.on("message-read", async ({ messageId, chatId, userId }) => {
      try {
        // Update in database
        await prisma.message.update({
          where: { id: messageId },
          data: {
            readBy: {
              connect: { id: userId },
            },
          },
        });

        socket.to(chatId).emit("message-read", { messageId, userId });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// Helper function to save messages
async function saveMessage(message: Message, chatId: string): Promise<Message> {
  const userId = message.senderId!;

  if (message.type === "TEXT") {
    const saved = await prisma.message.create({
      data: {
        type: "TEXT",
        chatId,
        textContent: {
          create: {
            text: message.content.text,
            userMessage: {
              create: {
                userId,
              },
            },
          },
        },
        readBy: {
          connect: { id: userId },
        },
      },
      include: {
        textContent: {
          include: {
            userMessage: true,
          },
        },
        readBy: true,
      },
    });

    return {
      id: saved.id,
      type: "TEXT",
      content: { text: saved.textContent!.text },
      senderId: userId,
      status: "sent",
      createdAt: saved.createdAt,
      isRead: false,
    };
  }

  if (message.type === "MEDIA") {
    // First create media files
    const mediaFiles = await Promise.all(
      message.content.urls.map((url) =>
        prisma.mediaFile.create({
          data: {
            url,
            type: "IMAGE",
          },
        })
      )
    );

    const saved = await prisma.message.create({
      data: {
        type: "MEDIA",
        chatId,
        mediaContent: {
          create: {
            files: {
              connect: mediaFiles.map((f) => ({ id: f.id })),
            },
            userMessage: {
              create: {
                userId,
              },
            },
          },
        },
        readBy: {
          connect: { id: userId },
        },
      },
      include: {
        mediaContent: {
          include: {
            files: true,
            userMessage: true,
          },
        },
        readBy: true,
      },
    });

    return {
      id: saved.id,
      type: "MEDIA",
      content: { urls: saved.mediaContent!.files.map((f) => f.url) },
      senderId: userId,
      status: "sent",
      createdAt: saved.createdAt,
      isRead: false,
    };
  }

  throw new Error(`Unsupported message type: ${message.type}`);
}
