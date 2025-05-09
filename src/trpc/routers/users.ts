import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "..";

export const usersRouter = createTRPCRouter({
  many: protectedProcedure
    .input(
      z
        .object({
          includeMe: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx: { prisma, session }, input }) => {
      const includeMe = input?.includeMe ?? false;
      const users = await prisma.user.findMany({
        where: includeMe ? {} : { id: { not: session.user.id } },
      });

      return users;
    }),

  sigle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input }) => {
      try {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
    }),
});
