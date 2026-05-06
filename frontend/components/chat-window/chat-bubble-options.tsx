"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Reply, Trash2, Pin, MoreHorizontal } from "lucide-react";

interface ChatBubbleMenuProps {
  onReply?: () => void;
  onRemove?: () => void;
  onPin?: () => void;
}

export function ChatBubbleMenu({ onReply, onRemove, onPin }: ChatBubbleMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-48 bg-[#1e2030] border border-white/[0.08] rounded-[14px] p-1.5 shadow-2xl"
      >
        <DropdownMenuItem
          onClick={onReply}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-white/90 text-[15px] cursor-pointer hover:bg-white/[0.09] focus:bg-white/[0.09]"
        >
          <Reply className="w-[17px] h-[17px]" strokeWidth={1.75} />
          Reply
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onRemove}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-red-400/95 text-[15px] cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10"
        >
          <Trash2 className="w-[17px] h-[17px]" strokeWidth={1.75} />
          Remove
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onPin}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-white/90 text-[15px] cursor-pointer hover:bg-white/[0.09] focus:bg-white/[0.09]"
        >
          <Pin className="w-[17px] h-[17px]" strokeWidth={1.75} />
          Pin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}