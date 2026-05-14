"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Users } from "lucide-react";
import { useFriends } from "@/lib/hooks/use-friends";
import { useRooms } from "@/lib/hooks/use-rooms";
import { getAvatarGradient } from "@/lib/utils/avatar";

export function NewGroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { friends, loading } = useFriends();
  const { createRoom } = useRooms();
  const [groupName, setGroupName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCreate = () => {
    if (!groupName.trim()) return;
    createRoom(groupName.trim(), Array.from(selectedIds));
    setGroupName("");
    setSelectedIds(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-[#343434] text-[#F3F4F6] sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5" />
            New Group Chat
          </DialogTitle>
        </DialogHeader>

        <div className="mt-3 space-y-4">
          <div>
            <label className="text-xs text-[#9CA3AF] mb-1.5 block">
              Group Name
            </label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name..."
              className="bg-[#2A2A2A] border-[#343434] text-white focus-visible:ring-1 focus-visible:ring-[#343434]"
            />
          </div>

          <div>
            <label className="text-xs text-[#9CA3AF] mb-1.5 block">
              Add Members {selectedIds.size > 0 && `(${selectedIds.size} selected)`}
            </label>
            <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto custom-scrollbar">
              {loading && (
                <p className="text-sm text-[#6B7280] text-center py-4">Loading friends…</p>
              )}
              {!loading && friends.length === 0 && (
                <p className="text-sm text-[#9CA3AF] text-center py-6">
                  No friends to add. Use &quot;Add Contact&quot; first!
                </p>
              )}
              {friends.map((friendReq) => {
                const user = friendReq.profile;
                const isSelected = selectedIds.has(user.id);
                return (
                  <div
                    key={friendReq.id}
                    onClick={() => toggleMember(user.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#00B4D8]/10 border border-[#00B4D8]/30"
                        : "hover:bg-[#2A2A2A] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.username}
                            className="w-9 h-9 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-9 h-9 rounded-full ${getAvatarGradient(user.id)}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">@{user.username}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#00B4D8] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={!groupName.trim()}
            className="w-full bg-gradient-to-r from-[#00B4D8] to-[#008BA6] text-white hover:opacity-90 disabled:opacity-40"
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
