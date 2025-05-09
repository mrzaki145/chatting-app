import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";

export const messagesRouter = createTRPCRouter({
  // get messages
  many: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input }) => {
      const isUserInChat = await prisma.chat.count({
        where: {
          id: input.chatId,
          users: {
            some: {
              id: session?.user.id,
            },
          },
        },
      });

      if (!isUserInChat) {
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this chat",
        });
      }

      const limit = input.limit ?? 1;
      const { cursor } = input;

      const messages = await prisma.message.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          chatId: input.chatId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),

  // create message
  send: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session, pusher }, input }) => {
      const isUserInChat = await prisma.chat.count({
        where: {
          id: input.chatId,
          users: {
            some: {
              id: session?.user.id,
            },
          },
        },
      });

      if (!isUserInChat) {
        new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not a member of this chat",
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          content: input.content,
          chat: {
            connect: {
              id: input.chatId,
            },
          },
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
        include: {
          user: true,
        },
      });

      await pusher.trigger(`chat-${input.chatId}`, "new-message", newMessage);

      return newMessage;
    }),
});
