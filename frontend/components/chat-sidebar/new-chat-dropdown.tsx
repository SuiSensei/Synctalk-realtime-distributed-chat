"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Users, UserPlus } from "lucide-react";
import { useState } from "react";
import { AddContactDialog } from "./add-contact-dialog";
import { NewChatDialog } from "./new-chat-dialog";
import { NewGroupDialog } from "./new-group-dialog";

export function NewChatDropdown({ onRoomReady }: { onRoomReady?: (roomId: string) => void }) {
  const [showAddContact, setShowAddContact] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button
          className="h-8 gap-2 bg-transparent border border-[#343434] text-[#F3F4F6] hover:!bg-[#2A2A2A] hover:!text-white rounded-[6px] shadow-none px-3 focus-visible:!ring-0 focus-visible:!border-[#343434] focus-visible:outline-none"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="text-sm font-medium">New</span>
        </Button>
      </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-48 bg-[#1C1C1C] border-[#343434] rounded-[6px] shadow-xl p-1 mt-1"
          align="end"
        >
          <DropdownMenuItem onClick={() => setShowNewChat(true)} className="p-0 cursor-pointer rounded-[4px] focus:!bg-[#2A2A2A] data-[highlighted]:!bg-[#2A2A2A] focus:!text-[#F3F4F6] data-[highlighted]:!text-[#F3F4F6] transition-colors">
            <div className="flex items-center gap-3 w-full h-full p-2 text-[#F3F4F6]">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">New Chat</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowNewGroup(true)} className="p-0 cursor-pointer rounded-[4px] focus:!bg-[#2A2A2A] data-[highlighted]:!bg-[#2A2A2A] focus:!text-[#F3F4F6] data-[highlighted]:!text-[#F3F4F6] transition-colors">
            <div className="flex items-center gap-3 w-full h-full p-2 text-[#F3F4F6]">
              <Users className="w-4 h-4" />
              <span className="text-sm">New Group Chat</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowAddContact(true)} className="p-0 cursor-pointer rounded-[4px] focus:!bg-[#2A2A2A] data-[highlighted]:!bg-[#2A2A2A] focus:!text-[#F3F4F6] data-[highlighted]:!text-[#F3F4F6] transition-colors">
            <div className="flex items-center gap-3 w-full h-full p-2 text-[#F3F4F6]">
              <UserPlus className="w-4 h-4" />
              <span className="text-sm">Add Contact</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddContactDialog open={showAddContact} onOpenChange={setShowAddContact} />
      <NewChatDialog open={showNewChat} onOpenChange={setShowNewChat} onRoomReady={onRoomReady} />
      <NewGroupDialog open={showNewGroup} onOpenChange={setShowNewGroup} />
    </>
  );
}