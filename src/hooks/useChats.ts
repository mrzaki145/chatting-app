import { trpc } from "@/lib/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useChats({
  searchText,
  limit = 15,
}: {
  searchText: string;
  limit?: number;
}) {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    status,
    error,
    isLoading,
  } = useInfiniteQuery(
    trpc.chats.many.infiniteQueryOptions(
      {
        limit,
        name: searchText,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        select: (data) => {
          const flattened = data.pages.flatMap((page) => page.chats);
          return {
            pages: data.pages,
            pageParams: data.pageParams,
            chats: flattened.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            ),
          };
        },
      }
    )
  );

  const chats = data?.pages
    .flatMap((page) => page.chats)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return {
    chats,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    status,
    error,
    refetch,
    isEmpty: status === "success" && chats?.length === 0,
  };
}
