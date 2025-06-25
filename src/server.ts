import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { prisma } from "./lib/prisma";
import { Message } from "./lib/types";

declare global {
  var io: Server | undefined;
}

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Store active socket connections mapped to user IDs
const userSocketMap = new Map<string, Set<string>>();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end("Bad Request: URL missing");
      return;
    }

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Simplified authentication middleware
  io.use(async (socket, next) => {
    try {
      // Get the user ID from the handshake
      const userId = socket.handshake.auth.userId;

      if (!userId) {
        return next(new Error("No user ID provided"));
      }

      // Verify the user exists in the database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!user) {
        return next(new Error("User not found"));
      }

      // Attach user info to socket
      socket.data.userId = user.id;
      socket.data.user = user;

      console.log(
        `✅ Socket authenticated for user: ${user.email} (${user.id})`
      );
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      next(new Error("Authentication failed"));
    }
  });

  // SINGLE connection handler - handles both chat and notifications
  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    console.log(`✅ Client connected: ${socket.id} for user ${userId}`);

    // Add socket to user's socket set for tracking
    if (userId) {
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId)!.add(socket.id);

      // Join user-specific room for notifications
      const userRoom = `user:${userId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined notification room: ${userRoom}`);
    }

    // Handle joining a chat room
    socket.on("join-chat", async ({ chatId, userId: requestUserId }) => {
      try {
        // Verify the request is from the authenticated user
        if (requestUserId !== userId) {
          socket.emit("error", "Unauthorized request");
          return;
        }

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
        // Verify sender matches authenticated user
        if (message.senderId !== userId) {
          socket.emit("error", "Unauthorized message");
          return;
        }

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

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Remove socket from user's socket set
      if (userId && userSocketMap.has(userId)) {
        userSocketMap.get(userId)!.delete(socket.id);
        if (userSocketMap.get(userId)!.size === 0) {
          userSocketMap.delete(userId);
        }
      }
    });
  });

  // Export io instance so we can use it in server actions
  global.io = io;

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
      status: "SENT",
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

  // Transform database message to our simplified Message type
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
