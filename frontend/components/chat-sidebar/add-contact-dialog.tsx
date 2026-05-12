import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Clock } from "lucide-react";
import { useFriends } from "@/lib/hooks/use-friends";
import { getAvatarGradient } from "@/lib/utils/avatar";

export function AddContactDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { searchUsers, sendRequest, sentRequests, friends, pendingRequests } = useFriends();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const res = await searchUsers(query);
      setResults(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1C1C1C] border-[#343434] text-[#F3F4F6] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Contact</DialogTitle>
        </DialogHeader>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username..."
            className="pl-9 bg-[#2A2A2A] border-[#343434] text-white focus-visible:ring-1 focus-visible:ring-[#343434]"
          />
        </div>
        <div className="mt-4 flex flex-col gap-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {results.length === 0 && query && (
            <p className="text-sm text-[#9CA3AF] text-center py-4">No users found.</p>
          )}
          {results.map((user) => {
            const isFriend = friends.some(f => f.profile.id === user.id);
            const isPendingMe = pendingRequests.some(r => r.profile.id === user.id);
            const isSent = sentRequests.includes(user.id);
            
            return (
              <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors">
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
                {isFriend ? (
                  <Button variant="ghost" disabled className="text-[#9CA3AF] h-8 text-xs">Friend</Button>
                ) : isPendingMe ? (
                  <Button variant="ghost" disabled className="text-[#9CA3AF] h-8 text-xs">Review Request</Button>
                ) : isSent ? (
                  <Button variant="outline" disabled className="h-8 text-xs gap-1 border-[#343434] bg-transparent text-[#9CA3AF]">
                    <Clock className="w-3 h-3" /> Sent
                  </Button>
                ) : (
                  <Button 
                    onClick={() => sendRequest(user.id)}
                    className="h-8 text-xs gap-1 bg-[#2A2A2A] hover:bg-[#343434] text-white border border-[#343434]"
                  >
                    <UserPlus className="w-3 h-3" /> Add
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
