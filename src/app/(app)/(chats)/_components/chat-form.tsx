"use client";

import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Smile } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});

interface Props {
  chatId: string;
}

function ChatForm({ chatId }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { mutateAsync } = useMutation(
    trpc.messages.send.mutationOptions({
      onSuccess() {
        form.reset();
      },
    })
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await mutateAsync({
      chatId,
      content: data.message,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative flex items-center gap-2 h-11"
      >
        <Popover>
          <PopoverTrigger asChild>
            <div className="absolute z-10 start-1 inset-y-0 flex items-center justify-center">
              <Button size="icon" variant="ghost" type="button">
                <Smile size={18} />
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-fit p-0"
            align="start"
            sideOffset={20}
            alignOffset={-10}
          >
            <EmojiPicker
              className="h-[342px]"
              onEmojiSelect={({ emoji }) => {
                form.setValue("message", `${form.getValues().message}${emoji}`);
              }}
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
            </EmojiPicker>
          </PopoverContent>
        </Popover>

        <FormField
          name="message"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex-1 h-full">
              <FormControl>
                <Input {...field} className="h-auto ps-10" />
              </FormControl>
            </FormItem>
          )}
        />

        <LoadingButton
          type="submit"
          className="h-full"
          loading={form.formState.isSubmitting}
        >
          Send
        </LoadingButton>
      </form>
    </Form>
  );
}

export default ChatForm;
