"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/context/sidebar-context";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Info, Users } from "lucide-react";

interface Props {
  chatId: string;
}

function ChatNav({ chatId: id }: Props) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { data: chat, isLoading } = useQuery(
    trpc.chats.single.queryOptions({ id })
  );

  if (isLoading) {
    return null;
  }

  if (!chat) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      <div className="flex items-center gap-2">
        <Avatar className="size-8 shrink-0">
          {chat.isGroup ? (
            <AvatarFallback>
              <Users className="size-4" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage
                src={chat.users[0].image ?? ""}
                alt={chat.users[0].name}
              />
              <AvatarFallback>{chat.users[0].name[0]}</AvatarFallback>
            </>
          )}
        </Avatar>
        <div>
          <h3 className="text-sm font-medium">{chat.name}</h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {chat.isGroup && (
          <>
            <AvatarGroup className="flex items-center" max={3}>
              {chat.users.map((user) => (
                <TooltipProvider key={user.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="size-8 shrink-0">
                        <AvatarImage src={user.image ?? ""} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{user.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </AvatarGroup>
            <Separator orientation="vertical" className="h-6! ms-1" />
          </>
        )}

        <Button size="icon" variant="ghost" onClick={toggleSidebar}>
          <Info size={16} />
        </Button>
      </div>
    </div>
  );
}

export default ChatNav;
