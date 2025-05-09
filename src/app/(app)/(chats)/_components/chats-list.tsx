"use client";

import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/hooks/useChats";
import { authClient } from "@/lib/auth-client";
import pusherClient from "@/lib/pusher";
import { debounce } from "@tanstack/react-pacer/debouncer";
import { Loader2, MessageSquareX, Search } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import ChatListItem from "./chat-list-item";

const ChatItemSkeleton = memo(() => (
  <div className="flex items-center gap-3 border-b border-border pb-3.5 last:border-b-0">
    <Avatar className="size-9">
      <Skeleton className="size-full" />
    </Avatar>
    <div className="flex-1 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-3 w-full" />
    </div>
  </div>
));

const ChatsList = memo(() => {
  const { data: session } = authClient.useSession();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const {
    chats,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    isEmpty,
    refetch,
  } = useChats({
    searchText: debouncedSearchText,
  });
  const debouncedSetSearch = useCallback(
    debounce(setDebouncedSearchText, {
      wait: 500,
    }),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchText(newValue);
      debouncedSetSearch(newValue);
    },
    [debouncedSetSearch]
  );

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`user-${session.user.id}`);

    channel.bind("new-chat", refetch);

    return () => {
      channel.unbind("new-chat", refetch);
      // pusherClient.unsubscribe(`user-${session.user.id}`);
    };
  }, [session?.user?.id]);

  return (
    <>
      <div className="flex items-center relative">
        <Search className="size-4 absolute left-3" />
        <Input
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search"
          className="w-full ps-9"
        />
      </div>

      <div className="relative flex-1 flex mt-2">
        {isLoading ? (
          <div className="flex flex-col gap-3 w-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <ChatItemSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <ScrollArea className="absolute! inset-0">
              <ul>
                {chats?.map((chat) => (
                  <ChatListItem key={chat.id} chat={chat} />
                ))}
              </ul>
            </ScrollArea>

            {hasNextPage && (
              <div className="flex justify-center mt-4">
                <LoadingButton
                  size="sm"
                  variant="outline"
                  onClick={() => fetchNextPage()}
                  loading={isFetchingNextPage}
                >
                  {isFetchingNextPage && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Load More
                </LoadingButton>
              </div>
            )}
          </>
        )}

        {isEmpty && (
          <p className="text-muted-foreground flex flex-col gap-2 items-center justify-center w-full text-center text-sm">
            <MessageSquareX size={28} />
            No chats yet
          </p>
        )}
      </div>
    </>
  );
});

export default ChatsList;
