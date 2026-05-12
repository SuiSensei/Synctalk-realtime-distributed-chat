import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CircleUser, Settings, LogOut, ChevronsUpDown, Users } from "lucide-react";
import { usePresence } from "@/lib/hooks/use-presence";
import { createClient } from "@/lib/supabase/client";
import { FriendRequestsDialog } from "../chat-sidebar/friend-requests-dialog";
import { useFriends } from "@/lib/hooks/use-friends";

export function UserDropdown() {
  const { myProfile, updateStatus } = usePresence();
  const { pendingRequests } = useFriends();
  const [email, setEmail] = useState<string>("");
  const [showRequests, setShowRequests] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
      }
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const displayName = myProfile ? `${myProfile.first_name} ${myProfile.last_name}` : "User";
  const avatarInitials = myProfile?.first_name?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-full p-0 px-4 rounded-none shadow-none transition-colors border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent"
        >
        <div className="relative">
          <Avatar className="w-7 h-7 rounded-full">
            <AvatarImage src={myProfile?.avatar_url} />
            <AvatarFallback className="bg-emerald-500 text-white font-medium text-xs">{avatarInitials}</AvatarFallback>
          </Avatar>
          {pendingRequests.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3ddc84] text-[#1C1C1C] text-[9px] font-bold flex items-center justify-center leading-none">
              {pendingRequests.length > 9 ? "9+" : pendingRequests.length}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start text-left hidden sm:flex">
          <span className="text-[13px] font-medium text-foreground leading-tight">{displayName}</span>
          <span className="text-[11px] text-muted-foreground leading-tight truncate max-w-[120px]">{email}</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-muted-foreground ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 bg-[#1C1C1C] border border-[#343434] rounded-[5px] shadow-none p-1 mt-0" 
        align="center"
      >
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <Avatar className="w-9 h-9 rounded-full">
            <AvatarImage src={myProfile?.avatar_url} />
            <AvatarFallback className="bg-emerald-500 text-white font-medium">{avatarInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">{displayName}</span>
            <span className="text-xs text-muted-foreground truncate max-w-[160px]">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#343434]" />
        <DropdownMenuItem className="gap-2 p-2 rounded-[5px] hover:bg-white/5 cursor-pointer">
          <CircleUser className="w-4 h-4" />
          <span className="text-sm">Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 p-2 rounded-[5px] hover:bg-white/5 cursor-pointer">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowRequests(true)} className="gap-2 p-2 rounded-[5px] hover:bg-white/5 cursor-pointer flex justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Friend Requests</span>
          </div>
          {pendingRequests.length > 0 && (
            <span className="bg-[#3ddc84] text-[#1C1C1C] text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[#343434]" />
        <DropdownMenuItem onClick={handleLogout} className="gap-2 p-2 rounded-[5px] text-red-500 hover:bg-red-500/10 hover:text-red-500 cursor-pointer focus:bg-red-500/10 focus:text-red-500">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <FriendRequestsDialog open={showRequests} onOpenChange={setShowRequests} />
    </>
  );
}