import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

import { type Message } from "./lib/types";
import { MessageType } from "@prisma/client";
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
    socket.on("join-chat", ({ chatId }) => {
      console.log(`User joined chat: ${chatId}`);
      socket.join(chatId);
    });

    socket.on(
      "message",
      async ({ message, chatId }: { message: Message; chatId: string }) => {
        console.log("Received message:", message);
        socket.to(chatId).emit("message", message);

        try {
          const newMessage = await uploadMessage(message, chatId);

          console.log("Message saved:", newMessage);
          socket.to(chatId).emit("message-saved", {
            message: newMessage,
            tempId: message.id,
          });
        } catch {
          socket.emit("message-error", {
            tempId: message.id,
          });
        }
      }
    );

    socket.on("typing-start", (data) => {
      try {
        const { chatId, userId } = data;

        if (!chatId || !userId) {
          console.error("Missing chatId or userId in typing-start event");
          return;
        }

        socket.broadcast.to(chatId).emit("typing-start", {
          userId,
          chatId,
        });
      } catch (error) {
        console.error("Error handling typing-start:", error);
      }
    });

    socket.on("typing-stop", (data) => {
      try {
        const { chatId, userId } = data;

        if (!chatId || !userId) {
          console.error("Missing chatId or userId in typing-stop event");
          return;
        }

        socket.broadcast.to(chatId).emit("typing-stop", {
          userId,
          chatId,
        });
      } catch (error) {
        console.error("Error handling typing-stop:", error);
      }
    });

    socket.on("disconnect", () => {});
  });

  server.listen(port);
});

const uploadMessage = async (
  message: Message,
  chatId: string
): Promise<Message> => {
  // only system messages lack a senderId
  // so we can safely cast it to string
  const userId = message.senderId as string;

  const prismaMessage = await prisma.message.create({
    data: {
      chat: {
        connect: {
          id: chatId,
        },
      },
      type: message.type as MessageType,
      createdAt: message.createdAt,
      readBy: {
        connect: {
          id: userId,
        },
      },
      textContent:
        message.type === "TEXT"
          ? {
              create: {
                text: message.content.text,
                userMessage: {
                  create: {
                    userId,
                  },
                },
              },
            }
          : undefined,
      mediaContent:
        message.type === "MEDIA"
          ? {
              create: {
                urls: {
                  createMany: {
                    data: message.content.urls.map((url) => ({ url })),
                  },
                },
                userMessage: {
                  create: {
                    userId,
                  },
                },
              },
            }
          : undefined,
    },
    select: {
      id: true,
      createdAt: true,
      type: true,
      textContent: {
        select: {
          text: true,
          userMessage: {
            select: {
              userId: true,
            },
          },
        },
      },
      mediaContent: {
        select: {
          urls: {
            select: {
              url: true,
            },
          },
          userMessage: {
            select: {
              userId: true,
            },
          },
        },
      },
      readBy: {
        select: {
          id: true,
        },
      },
    },
  });

  if (message.type !== "TEXT" && message.type !== "MEDIA") {
    throw new Error(`Unsupported message type: ${message.type}`);
  }

  return {
    id: prismaMessage.id,
    createdAt: prismaMessage.createdAt,
    isRead: false,
    type: prismaMessage.type as MessageType,
    content:
      prismaMessage.type === "TEXT"
        ? { text: prismaMessage.textContent?.text || "" }
        : { urls: prismaMessage.mediaContent?.urls || [] },
    senderId:
      prismaMessage.textContent?.userMessage.userId ||
      prismaMessage.mediaContent?.userMessage.userId ||
      null,
  } as Message;
};
