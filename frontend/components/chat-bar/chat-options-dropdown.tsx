"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, LogOut, Trash2 } from "lucide-react";
import { useRooms } from "@/lib/hooks/use-rooms";

interface ChatOptionsDropdownProps {
  roomId: string;
}

export function ChatOptionsDropdown({ roomId }: ChatOptionsDropdownProps) {
  const { leaveRoom } = useRooms();

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave this group?")) {
      leaveRoom(roomId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#2A2A2A]">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-48 bg-[#1C1C1C] border-[#343434] rounded-[6px] shadow-xl p-1"
        align="end"
      >
        <DropdownMenuItem onClick={handleLeave} className="p-0 cursor-pointer rounded-[4px] focus:!bg-[#2A2A2A] data-[highlighted]:!bg-[#2A2A2A] focus:!text-[#F3F4F6] data-[highlighted]:!text-[#F3F4F6] focus:[&_*]:!text-[#F3F4F6] data-[highlighted]:[&_*]:!text-[#F3F4F6] transition-colors">
          <div className="flex items-center gap-3 w-full h-full p-2 text-red-500 hover:text-red-400">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Leave Group</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}