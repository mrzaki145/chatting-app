import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";

export const chatRouter = createTRPCRouter({
  // all chats
  many: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input }) => {
      const limit = input.limit ?? 1;
      const { cursor } = input;

      const chats = await prisma.chat.findMany({
        take: limit + 1,
        where: {
          users: {
            some: {
              id: session.user.id,
            },
          },
          name: {
            contains: input.name,
            mode: "insensitive",
          },
        },
        include: {
          users: {
            where: {
              id: {
                not: session.user.id,
              },
            },
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (chats.length > limit) {
        const nextItem = chats.pop();
        nextCursor = nextItem!.id;
      }

      return {
        chats,
        nextCursor,
      };
    }),

  // single chat
  single: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input }) => {
      try {
        const chat = await prisma.chat.findUniqueOrThrow({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            name: true,
            isGroup: true,
            createdAt: true,
            users: {
              where: {
                id: {
                  not: session.user.id,
                },
              },
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            messages: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              select: {
                id: true,
                content: true,
                createdAt: true,
              },
            },
          },
          // include: {
          //   isGroup: true,
          //   users: {
          //     where: {
          //       id: {
          //         not: session.user.id,
          //       },
          //     },
          //     select: {
          //       id: true,
          //       name: true,
          //       image: true,
          //     },
          //   },
          //   messages: {
          //     orderBy: {
          //       createdAt: "desc",
          //     },
          //     take: 1,
          //     select: {
          //       id: true,
          //       content: true,
          //       createdAt: true,
          //     },
          //   },
          // },
        });
        return chat;
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: error.message,
          });
        }
      }
    }),

  // create chat
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        users: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx: { prisma, session, pusher }, input }) => {
      const { name, users } = input;
      const chat = await prisma.chat.create({
        data: {
          name: name,
          isGroup: users.length > 1,
          users: {
            connect: [...users, session.user.id].map((id) => ({ id })),
          },
        },
        include: {
          users: {
            where: {
              id: {
                not: session.user.id,
              },
            },
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          messages: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
            select: {
              id: true,
              content: true,
              createdAt: true,
            },
          },
        },
      });

      const allUserIds = [...users, session.user.id];
      allUserIds.forEach((userId) => {
        pusher.trigger(`user-${userId}`, "new-chat", chat);
      });

      return chat;
    }),

  // delete chat
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx: { prisma }, input }) => {
      const chatExists = await prisma.chat.count({
        where: {
          id: input,
        },
      });

      if (!chatExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      await prisma.chat.delete({
        where: {
          id: input,
        },
      });
    }),
});
