"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/sidebar-context";
import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";

interface Props {
  chatId: string;
}

function ChatInfo({ chatId: id }: Props) {
  const { isSidebarOpen } = useSidebar();
  const { data: chat } = useQuery(
    trpc.chats.single.queryOptions(
      { id },
      {
        enabled: isSidebarOpen,
      }
    )
  );

  if (!chat) return null;

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <div className="size-full  lg:w-94">
      <div className="h-full flex-1 flex flex-col justify-between rounded-xl bg-white/5 p-4">
        <div className="flex flex-col items-center text-center pt-10">
          <Avatar className="size-28 mx-auto mb-6">
            {chat.isGroup ? (
              <AvatarFallback>
                <Users className="size-10" />
              </AvatarFallback>
            ) : (
              <>
                <AvatarImage
                  src={chat.users[0].image ?? ""}
                  alt={chat.users[0].name}
                />
                <AvatarFallback className="text-4xl">
                  {chat.users[0].name[0]}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          <h2 className="text-xl font-semibold mb-2">{chat.name}</h2>
          {chat.isGroup ? (
            <p className="text-sm text-muted-foreground mb-6">
              Group chat for collaboration and discussion
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-6">
              Direct message conversation
            </p>
          )}

          <div className="w-full border-t border-white/10 pt-6">
            <div className="flex flex-col gap-4 text-start">
              <div>
                <p className="font-semibold mb-1">Created</p>
                <p className="text-sm text-muted-foreground">
                  {chat.createdAt.toLocaleDateString()}
                </p>
              </div>

              {chat.isGroup && (
                <div>
                  <p className="font-semibold mb-2">
                    {chat.isGroup ? "Members" : "Participant"}
                  </p>

                  <div className="flex flex-col gap-2">
                    {chat.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Avatar className="size-6">
                          <AvatarImage src={user.image ?? ""} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <p>{user.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full gap-3 mt-6">
          {chat.isGroup && (
            <Button variant="outline" className="flex-1" onClick={() => {}}>
              Add Members
            </Button>
          )}

          {chat.isGroup ? (
            <Button variant="destructive" className="flex-1" onClick={() => {}}>
              Leave Chat
            </Button>
          ) : (
            <Button variant="destructive" className="flex-1" onClick={() => {}}>
              Delete Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatInfo;
