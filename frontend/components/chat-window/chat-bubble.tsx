"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message?: string;
  timestamp?: string;
  avatarSrc?: string;
  avatarFallback?: string;
  typing?: boolean;
  showOptions?: boolean;
  onOptions?: () => void;
}

export function ChatBubble({
  message,
  timestamp,
  avatarSrc,
  avatarFallback = "U",
  typing = false,
}: ChatBubbleProps) {
  return (
    <div className="flex flex-col gap-1 w-fit max-w-xs">
      <div className="flex items-center gap-2">
        {/* Options trigger */}
        <button className="w-9 h-9 flex items-center justify-center rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 hover:bg-white/10 transition">
          ···
        </button>

        {/* Bubble */}
        <div
          className={cn(
            "rounded-[22px] px-5 py-3 bg-[#1c1c1e] border border-white/[0.07] text-white text-[15px] font-medium tracking-tight min-w-[60px] min-h-[44px] flex items-center",
            typing && "px-4"
          )}
        >
          {typing ? (
            <TypingIndicator />
          ) : (
            <span>{message}</span>
          )}
        </div>

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-11 h-11">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-sm font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#141414]" />
        </div>
      </div>

      {/* Timestamp + read receipt */}
      {!typing && timestamp && (
        <div className="flex items-center justify-end gap-1 pr-14">
          <span className="text-white/40 text-xs">{timestamp}</span>
          <CheckCheck className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
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