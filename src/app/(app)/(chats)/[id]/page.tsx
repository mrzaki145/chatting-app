import { SidebarProvider } from "@/context/sidebar-context";
import { caller } from "@/trpc/server";
import { TRPCError } from "@trpc/server";
import { notFound, redirect } from "next/navigation";
import ChatForm from "../_components/chat-form";
import ChatInfo from "../_components/chat-info";
import ChatMessages from "../_components/chat-messages";
import ChatNav from "../_components/chat-nav";

interface Props {
  params: Promise<{ id: string }>;
}

async function ChatPage({ params }: Props) {
  const { id } = await params;

  try {
    await caller.chats.single({ id });
  } catch (error) {
    if (!(error instanceof TRPCError)) return;

    if (error.code === "UNAUTHORIZED") {
      redirect("/sign-in");
    }
    if (error.code === "NOT_FOUND") {
      return notFound();
    }
  }

  return (
    <SidebarProvider>
      <div className="h-full flex gap-x-4">
        <div className="h-full flex-1 flex flex-col rounded-xl bg-white/5 p-4">
          <ChatNav chatId={id} />

          <ChatMessages chatId={id} />

          <ChatForm chatId={id} />
        </div>

        <ChatInfo chatId={id} />
      </div>
    </SidebarProvider>
  );
}

export default ChatPage;
