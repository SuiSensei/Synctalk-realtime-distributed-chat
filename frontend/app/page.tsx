import { ChatSidebar } from "@/components/chat-sidebar/chat-sidebar";

export default function Home() {
  return (
    <>
      {}

      <div className="flex flex-col h-screen bg-[#141414] overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <ChatSidebar />
          <main className="flex-1 flex items-center justify-center text-muted-foreground bg-[#141414]">
            Select a chat to start messaging
          </main>
        </div>
      </div>
    </>
  );
}
