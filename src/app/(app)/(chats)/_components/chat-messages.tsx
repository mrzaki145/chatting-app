"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useMessages } from "@/hooks/useMessages";
import { authClient } from "@/lib/auth-client";
import pusherClient from "@/lib/pusher";
import { cn, formatMessageTime, scrollToBottom } from "@/lib/utils";
import { Message } from "@/types/message";
import { Loader2 } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

interface Props {
  chatId: string;
}

const ChatMessageItem = memo(
  ({
    message,
    isCurrentUser,
  }: {
    message: Message;
    isCurrentUser: boolean;
  }) => {
    return (
      <div
        className={cn(
          "flex items-start gap-2.5",
          isCurrentUser
            ? "self-end flex-row-reverse text-end"
            : "self-start text-start"
        )}
      >
        <Avatar className="size-8 shrink-0">
          <AvatarImage
            src={message.user.image ?? ""}
            alt={message.user.name ?? "User"}
          />
          <AvatarFallback>{message.user.name?.[0]}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col  max-w-[320px] min-w-[150px] leading-1.5">
          <p className="text-sm font-semibold">{message.user.name}</p>
          <div className="bg-white/5 rounded-xl p-3 mt-2 mb-2">
            <p className="text-sm/relaxed text-start font-normal ">
              {message.content}
            </p>
          </div>
          <span className="text-[10px] font-normal text-muted-foreground">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      </div>
    );
  }
);

const ChatMessages = memo(({ chatId }: Props) => {
  const lastElementRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { data: session } = authClient.useSession();
  const {
    messages,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isEmpty,
  } = useMessages({ chatId, limit: 25 });
  const [latestMessages, setLatestMessages] = useState<Message[]>([]);

  const infiniteScrollRef = useInfiniteScroll(
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && !isLoading && !isInitialLoad
  );

  useEffect(() => {
    if (!lastElementRef.current) return;

    if (isInitialLoad && messages.length > 0) {
      scrollToBottom(lastElementRef.current);
      setIsInitialLoad(false);
    }
  }, [isInitialLoad, messages.length]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    const channel = pusherClient.subscribe(`chat-${chatId}`);

    const handleNewChat = (newMessage: Message) => {
      const messageExists = messages.some(
        (message) => message.id === newMessage.id
      );

      if (messageExists) return;
      setLatestMessages((prevMessages) => [...prevMessages, newMessage]);

      if (!isFetchingNextPage) {
        timerId = setTimeout(() => {
          scrollToBottom(lastElementRef.current);
        }, 100);
      }
    };

    channel.bind("new-message", handleNewChat);

    return () => {
      clearTimeout(timerId);
      channel.unbind("new-message", handleNewChat);
      // pusherClient.unsubscribe(`chat-${chatId}`); // Keep this if needed
    };
  }, [chatId, isFetchingNextPage]);

  return (
    <div className="relative flex-1 h-full mb-6">
      {isFetchingNextPage && (
        <div className="absolute top-0 inset-x-0 flex items-center justify-center gap-x-2 py-2">
          <Loader2 size={16} className="animate-spin" />{" "}
          <span className="text-sm">Loading...</span>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-0 inset-0 flex items-center justify-center gap-x-2 py-2">
          <Loader2 size={16} className="animate-spin" />{" "}
          <span className="text-sm">Loading...</span>
        </div>
      )}

      {!isLoading && (
        <ScrollArea className="absolute! inset-0">
          <ul className="flex flex-col h-full justify-end gap-6 pt-6">
            {messages &&
              messages.map((message, index, array) => (
                <li
                  key={message.id}
                  ref={
                    index === array.length - 1 ? infiniteScrollRef : undefined
                  }
                >
                  <ChatMessageItem
                    message={message}
                    isCurrentUser={message.userId === session?.user.id}
                  />
                </li>
              ))}

            {latestMessages.map((message) => (
              <li key={message.id}>
                <ChatMessageItem
                  message={message}
                  isCurrentUser={message.userId === session?.user.id}
                />
              </li>
            ))}
          </ul>

          <div ref={lastElementRef} />
        </ScrollArea>
      )}

      {isEmpty && latestMessages.length == 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-muted-foreground text-sm">No messages yet</p>
        </div>
      )}
    </div>
  );
});

export default ChatMessages;
