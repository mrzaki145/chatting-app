import "server-only";

import { TRPCQueryOptions } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createCallerFactory } from ".";
import { makeQueryClient } from "./client";
import { createTRPCContext } from "./context";
import { appRouter } from "./root";

export const getQueryClient = cache(makeQueryClient);

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();

  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}

const createCaller = createCallerFactory(appRouter);
export const caller = createCaller(createTRPCContext);
