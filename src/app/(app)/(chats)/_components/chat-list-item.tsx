import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import pusherClient from "@/lib/pusher";
import { trpc } from "@/lib/trpc";
import { formatMessageTime } from "@/lib/utils";
import { Chat } from "@/types/chat";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  chat: Chat;
}

const ChatListItem = memo(({ chat }: Props) => {
  const params = useParams();
  const router = useRouter();
  const { id, name, users, isGroup, messages, createdAt } = chat;
  const [latestMessage, setLatestMessage] = useState(messages.at(-1));
  const queryClient = useQueryClient();

  const deleteChatMutation = useMutation(
    trpc.chats.delete.mutationOptions({
      onSuccess() {
        const chatsQueryKey = trpc.chats.many.infiniteQueryKey();

        queryClient.invalidateQueries({
          queryKey: chatsQueryKey,
        });
        router.push("/");
      },
    })
  );

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      const fn = deleteChatMutation.mutateAsync(chatId);
      toast.promise(fn, {
        loading: "Deleting chat",
        success: "Chat deleted",
        error: "Failed to delete chat",
      });
    },
    [deleteChatMutation]
  );

  useEffect(() => {
    const channel = pusherClient.subscribe(`chat-${id}`);

    const handleNewMessage = (message: any) => {
      console.log("new-message", message);
      if (message.chatId !== id) return;
      setLatestMessage(message);
    };

    channel.bind("new-message", handleNewMessage);

    return () => {
      channel.unbind("new-message", handleNewMessage);
      // pusherClient.unsubscribe(`chat-${id}`);
    };
  }, [params.id]);

  return (
    <li className="group relative flex items-center border-b border-border py-3 first:pt-0 last:pb-0 last:border-b-0">
      <Link href={`/${id}`} className="flex items-center gap-3 flex-1">
        <Avatar className="size-9 shrink-0">
          {isGroup ? (
            <AvatarFallback>
              <Users className="size-4" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage
                src={users[0]?.image || undefined}
                alt={name || "User"}
              />
              <AvatarFallback>{name?.[0]}</AvatarFallback>
            </>
          )}
        </Avatar>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">{name}</p>
            <span className="text-muted-foreground shrink-0 group-hover:opacity-0 transition-opacity text-[10px]">
              {formatMessageTime(latestMessage?.createdAt || createdAt)}
            </span>
          </div>
          {latestMessage && (
            <p className="text-muted-foreground text-xs w-4/5 line-clamp-1">
              {latestMessage.content}
            </p>
          )}
        </div>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute end-0 ps-4 flex items-center justify-center inset-y-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" className="size-8 p-0 ">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={-10}>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleDeleteChat(id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
});

export default ChatListItem;
