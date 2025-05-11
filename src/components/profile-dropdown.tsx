"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  session: Session | null;
}

export function ProfileDropdown({ session }: Props) {
  const user = session?.user;
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!session) {
    return (
      <>
        <Link className={buttonVariants({ variant: "ghost" })} href="/sign-in">
          Sign in
        </Link>
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href="/sign-up"
        >
          Sign up
        </Link>
      </>
    );
  }

  async function handleLogout() {
    const fn = authClient.signOut({
      fetchOptions: {
        onSuccess() {
          const chatsQueryKey = trpc.chats.many.infiniteQueryKey();
          router.push("/sign-in");

          queryClient.invalidateQueries({
            queryKey: chatsQueryKey,
            exact: true,
          });
        },
      },
    });

    toast.promise(fn, {
      loading: "Logging out...",
      success: "Logged out",
      error: "Failed to log out",
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image ?? ""} alt={user?.name} />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user?.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
