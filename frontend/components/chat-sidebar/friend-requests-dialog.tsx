import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useFriends } from "@/lib/hooks/use-friends";
import { getAvatarGradient } from "@/lib/utils/avatar";

export function FriendRequestsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { pendingRequests, acceptRequest, rejectRequest, loading } = useFriends();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-[#343434] text-[#F3F4F6] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Friend Requests</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 flex flex-col gap-2 max-h-[400px] overflow-y-auto custom-scrollbar">
          {!loading && pendingRequests.length === 0 && (
            <p className="text-sm text-[#9CA3AF] text-center py-6">No pending friend requests.</p>
          )}
          {pendingRequests.map((req) => {
            const user = req.profile;
            return (
              <div key={req.id} className="flex items-center justify-between p-2 rounded-lg bg-[#2A2A2A]/50 border border-[#343434]">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${getAvatarGradient(user.id)}`} />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-[#9CA3AF]">@{user.username}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => acceptRequest(req.id)}
                    size="icon" 
                    className="w-8 h-8 rounded-full bg-[#3ddc84]/10 text-[#3ddc84] hover:bg-[#3ddc84]/20 hover:text-[#3ddc84]"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => rejectRequest(req.id)}
                    size="icon" 
                    className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
