import { createCallerFactory, createTRPCRouter, publicProcedure } from ".";
import { chatRouter } from "./routers/chats";
import { messagesRouter } from "./routers/messages";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  healthcheck: publicProcedure.query(() => "yay!"),

  users: usersRouter,
  chats: chatRouter,
  messages: messagesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
