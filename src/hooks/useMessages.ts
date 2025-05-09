import { trpc } from "@/lib/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMessages({
  chatId,
  limit,
}: {
  chatId: string;
  limit?: number;
}) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error,
    refetch,
  } = useInfiniteQuery({
    ...trpc.messages.many.infiniteQueryOptions({
      chatId,
      limit: limit || 10,
    }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    select: (data) => {
      const flattened = data.pages.flatMap((page) => page.messages);
      return {
        pages: data.pages,
        pageParams: data.pageParams,
        messages: flattened.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      };
    },
    refetchOnWindowFocus() {
      return false;
    },
    staleTime: 0,
    gcTime: 0,
  });

  return {
    messages: data?.messages || [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error,
    refetch,
    isEmpty: status === "success" && data.messages.length === 0,
  };
}
