import Sidebar from "./_components/sidebar";

function ChatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full gap-x-4">
      <div className="w-full lg:w-80">
        <Sidebar />
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
}

export default ChatsLayout;
