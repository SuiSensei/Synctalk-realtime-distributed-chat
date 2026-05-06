"use client";

import { ChatBubble } from "@/components/chat-window/chat-bubble";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-6">
      {/* Normal message */}
      <ChatBubble
        message="Aysa nalibang pako."
        timestamp="10:38 PM"
        avatarFallback="A"
      />

      {/* Typing state */}
      <ChatBubble
        typing={true}
        avatarFallback="A"
      />
    </div>
  );
}