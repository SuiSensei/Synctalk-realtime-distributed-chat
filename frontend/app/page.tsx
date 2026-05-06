import { ChatSidebar } from "@/components/chat-sidebar/chat-sidebar";
import { ChatContainer } from "@/components/chat-window/chat-container";

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-[#1C1C1C] overflow-hidden text-[#F3F4F6]">
      {}
      <ChatSidebar />
      
      {}
      <ChatContainer />
    </main>
  );
}