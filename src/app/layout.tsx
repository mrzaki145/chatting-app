import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/theme-context";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chatty",
  description: "Chat with your friends",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex h-dvh flex-col">{children}</div>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
