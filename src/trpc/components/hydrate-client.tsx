import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../client";

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const state = dehydrate(queryClient);

  return <HydrationBoundary state={state}>{props.children}</HydrationBoundary>;
}
