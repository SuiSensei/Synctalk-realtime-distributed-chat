import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useEffect } from "react";
import { useFriends } from "@/lib/hooks/use-friends";
import { useWebSocket } from "@/lib/contexts/websocket-context";
import { getAvatarGradient } from "@/lib/utils/avatar";

export function NewChatDialog({ open, onOpenChange, onRoomReady }: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  onRoomReady?: (roomId: string) => void
}) {
  const { friends, loading } = useFriends();
  const { sendMessage, subscribe } = useWebSocket();

  useEffect(() => {
    const unsub = subscribe("dm_room_ready", (data: any) => {
      onRoomReady?.(data.roomId);
      onOpenChange(false);
    });
    return unsub;
  }, [subscribe, onRoomReady, onOpenChange]);

  const handleStartChat = (friendId: string) => {
    // Send with empty text — backend will create/find the room and return dm_room_ready
    sendMessage({ type: "direct_message", recipientId: friendId, text: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-[#343434] text-[#F3F4F6] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New Chat</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {!loading && friends.length === 0 && (
            <p className="text-sm text-[#9CA3AF] text-center py-6">
              You haven't added any friends yet. Use "Add Contact" to find people!
            </p>
          )}
          {friends.map((friendReq) => {
            const user = friendReq.profile;
            return (
              <div 
                key={friendReq.id} 
                onClick={() => handleStartChat(user.id)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${getAvatarGradient(user.id)}`} />
                    )}
                    {user.is_online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#3ddc84] border-2 border-[#1C1C1C]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-[#9CA3AF]">@{user.username}</p>
                  </div>
                </div>
                <MessageSquarePlus className="w-5 h-5 text-[#9CA3AF]" />
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
