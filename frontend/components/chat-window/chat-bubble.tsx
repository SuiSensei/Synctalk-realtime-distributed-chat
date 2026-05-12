"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import { ChatBubbleOptions } from "./chat-bubble-options";
import { useWebSocket } from "@/lib/contexts/websocket-context";

interface ChatBubbleProps {
  message?: string;
  timestamp?: string;
  avatarFallback?: string;
  typing?: boolean;
  isSelf?: boolean;
  senderName?: string;
  reactions?: any[];
  messageId?: string;
}

export function ChatBubble({
  message,
  timestamp,
  avatarFallback = "U",
  typing = false,
  isSelf = false,
  senderName,
  reactions = [],
  messageId,
}: ChatBubbleProps) {
  const { sendMessage } = useWebSocket();

  const handleReact = (emoji: string) => {
    if (messageId) {
      sendMessage({ type: "add_reaction", messageId, emoji });
    }
  };

  return (
    <div className={cn("flex flex-col gap-1 w-fit max-w-md", isSelf ? "self-end items-end" : "self-start items-start")}>
      {!isSelf && senderName && !typing && (
        <span className="text-xs text-[#9CA3AF] ml-14">{senderName}</span>
      )}
      <div className={cn("flex items-end gap-2", isSelf && "flex-row-reverse")}>
        {!isSelf && (
          <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-[#00B4D8] to-[#008BA6] text-white text-sm font-semibold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <div className="group flex items-center gap-2">
          {!typing && <ChatBubbleOptions onReact={handleReact} />}

          <div
            className={cn(
              "rounded-[20px] px-4 py-2.5 text-[15px] font-medium tracking-tight min-w-[60px] min-h-[44px] flex items-center relative",
              isSelf
                ? "bg-gradient-to-br from-[#00B4D8] to-[#008BA6] text-white border-none rounded-br-[4px]"
                : "bg-[#252525] border border-[#343434] text-[#F3F4F6] rounded-bl-[4px]",
              typing && "px-4 py-3"
            )}
          >
            {typing ? (
              <TypingIndicator />
            ) : (
              <span>{message}</span>
            )}

            {/* Reactions */}
            {reactions && reactions.length > 0 && (
              <div className={cn(
                "absolute -bottom-3 flex gap-1",
                isSelf ? "left-0" : "right-0"
              )}>
                {Array.from(new Set(reactions.map(r => r.emoji))).map(emoji => (
                  <div key={emoji} className="bg-[#1C1C1C] border border-[#343434] rounded-full px-1.5 py-0.5 text-xs flex items-center justify-center">
                    {emoji}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {!typing && timestamp && (
        <div className={cn("flex items-center gap-1", isSelf ? "pr-2" : "pl-14")}>
          <span className="text-[#6B7280] text-xs">{timestamp}</span>
          {isSelf && <CheckCheck className="w-3.5 h-3.5 text-[#00B4D8]" strokeWidth={2.5} />}
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-[5px] px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-white/50 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}