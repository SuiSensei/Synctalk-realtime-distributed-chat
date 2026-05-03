import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatItemProps {
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  avatarColor: string;
  isOnline?: boolean;
  readStatus?: "sent" | "delivered" | "read";
  isActive?: boolean;
}

export function ChatItem({
  name,
  message,
  time,
  unreadCount = 0,
  avatarColor,
  isOnline = false,
  readStatus,
  isActive = false,
}: ChatItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-[#2A2A2A] hover:bg-[#252525]",
        isActive && "bg-[#252525]"
      )}
    >
      {}
      <div className="relative flex-shrink-0">
        <div
          className={cn(
            "w-12 h-12 rounded-full border border-black/20 shadow-inner",
            avatarColor
          )}
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] border-2 border-[#1C1C1C] rounded-full" />
        )}
      </div>

      {}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#F3F4F6] truncate pr-2">
            {name}
          </span>
          <span className="text-xs text-[#9CA3AF] whitespace-nowrap">
            {time}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {}
            {readStatus === "sent" && <Check className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
            {readStatus === "delivered" && <CheckCheck className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />}
            {readStatus === "read" && <CheckCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />}
            
            <p className="text-sm text-[#9CA3AF] truncate">
              {message}
            </p>
          </div>

          {}
          {unreadCount > 0 && (
            <div className="flex items-center justify-center w-5 h-5 bg-[#10B981] rounded-full flex-shrink-0">
              <span className="text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}