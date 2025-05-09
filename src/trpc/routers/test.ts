import { createTRPCRouter, publicProcedure } from "..";

export const testRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      greeting: `Hello world!`,
    };
  }),
});
