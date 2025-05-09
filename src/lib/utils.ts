import { clsx, type ClassValue } from "clsx";
import { format, isToday } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMessageTime(createdAt: Date | string): string {
  const messageDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  return format(messageDate, isToday(messageDate) ? "h:mm aa" : "MMM d, yyyy"); // e.g., "9:05 AM"
}

export const scrollToBottom = (element: HTMLElement | null, smooth = false) => {
  if (!element) return;

  element?.scrollIntoView({
    behavior: smooth ? "smooth" : "auto",
    block: "end",
    inline: "nearest",
  });
};
