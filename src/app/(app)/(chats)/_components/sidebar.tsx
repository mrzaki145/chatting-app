"use client";

import { trpc } from "@/lib/trpc";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import ChatsList from "./chats-list";
import { NewChat } from "./new-chat";

function Sidebar() {
  const [createConversationDialogOpened, setCreateConversationDialog] =
    useState(false);
  const { data: users } = useQuery(trpc.users.many.queryOptions());

  return (
    <div className="h-full flex flex-col rounded-xl bg-white/5 gap-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>

        <NewChat
          users={users!}
          open={createConversationDialogOpened}
          toggleOpen={setCreateConversationDialog}
        />
      </div>

      <ChatsList />
    </div>
  );
}

export default Sidebar;
