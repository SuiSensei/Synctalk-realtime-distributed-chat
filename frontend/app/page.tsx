"use client";

import { ChatBubbleMenu } from "@/components/chat-window/chat-bubble-options";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <ChatBubbleMenu
        onReply={() => console.log("Reply")}
        onRemove={() => console.log("Remove")}
        onPin={() => console.log("Pin")}
      />
    </div>
  );
}