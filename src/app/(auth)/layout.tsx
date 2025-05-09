import { SiLiberadotchat } from "react-icons/si";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="container grid h-svh max-w-none items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
        <div className="mb-6 flex items-center justify-center">
          <SiLiberadotchat size={22} className="mr-2" />
          <h1 className="text-xl font-semibold">Chatty</h1>
        </div>

        {children}
      </div>
    </div>
  );
}
