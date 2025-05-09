import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeSwitch } from "@/components/theme-switch";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiLiberadotchat } from "react-icons/si";
import { TRPCClientProvider } from "../providers/TRPCClientProvider";

interface Props {
  children: React.ReactNode;
}

export default async function AppLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");

  return (
    <TRPCClientProvider>
      <Header fixed>
        <Link href="/" className="flex items-center gap-3">
          <SiLiberadotchat size={22} />
          <h1 className="text-lg font-semibold">Chatty</h1>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <ProfileDropdown session={session} />
        </div>
      </Header>

      <Main>{children}</Main>
    </TRPCClientProvider>
  );
}
