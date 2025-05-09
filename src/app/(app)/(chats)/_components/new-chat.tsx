"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Check, MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().optional(),
    users: z
      .array(z.string(), { message: "Users are required" })
      .min(1, { message: "Select at least one user" }),
  })
  .refine(
    (data) => {
      if (data.users.length > 1) {
        return !!data.name?.length;
      }
      return true;
    },
    {
      message: "Group name is required when selecting more than one user",
      path: ["name"],
    }
  );

interface Props {
  users: User[];
}

export function NewChat({ users }: Props) {
  const router = useRouter();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      users: [],
    },
  });
  const { handleSubmit, control, watch, setValue, formState } = form;
  const selectedUsers = watch("users");

  // useCallback to memoize the onSelect handler
  const onSelectUser = useCallback(
    (user: User) => () => {
      setValue(
        "users",
        selectedUsers.includes(user.id)
          ? selectedUsers.filter((id) => id !== user.id)
          : [...selectedUsers, user.id]
      );
    },
    [selectedUsers, setValue]
  );

  const { mutateAsync: createGroupChat } = useMutation(
    trpc.chats.create.mutationOptions({
      onSuccess: ({ id }) => {
        toast.success("Chat created successfully");
        closeBtnRef.current?.click();
        router.push(`/${id}`);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      let chatData = { ...data } as any;

      if (data.users.length === 1) {
        const user = users?.find((user) => user.id === data.users[0]);
        chatData.name = user?.name ?? "";
      }

      await createGroupChat(chatData);
    });
  };

  return (
    <Dialog
      onOpenChange={() =>
        setTimeout(() => {
          form.reset();
        }, 150)
      }
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MessageSquarePlus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="mb-2">
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Select people to start messaging.
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {selectedUsers.length > 1 && (
              <FormField
                name="name"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Group name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="users"
              control={control}
              render={() => (
                <FormItem>
                  <FormControl>
                    <Command>
                      <CommandList className="p-0">
                        <CommandEmpty>No people found.</CommandEmpty>

                        <CommandGroup>
                          {users?.map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={onSelectUser(user)}
                              className="flex items-center justify-between gap-2 mb-1"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="size-8 shrink-0">
                                  <AvatarImage
                                    src={user.image ?? ""}
                                    alt={user.name}
                                  />
                                  <AvatarFallback>
                                    {user.name[0]}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium">
                                    {user.name}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {user.email}
                                  </span>
                                </div>
                              </div>

                              {selectedUsers.includes(user.id) && (
                                <Check className={cn("ml-auto")} />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {users && users.length > 0 && (
              <LoadingButton
                type="submit"
                className="w-full"
                loading={isPending}
              >
                Create
              </LoadingButton>
            )}

            <DialogClose ref={closeBtnRef} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
