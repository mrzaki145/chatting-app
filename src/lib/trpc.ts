import { getQueryClient, trpcClient } from "@/trpc/client";
import { AppRouter } from "@/trpc/root";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient: getQueryClient(),
});
