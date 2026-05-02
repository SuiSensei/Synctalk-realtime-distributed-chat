import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CircleUser, Settings, LogOut, ChevronsUpDown } from "lucide-react";

export function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-full p-0 px-2 rounded-none shadow-none transition-colors border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent"
        >
          <Avatar className="w-6 h-6 rounded-full">
            <AvatarFallback className="bg-emerald-500"></AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left hidden sm:flex">
            <span className="text-[13px] font-medium text-foreground leading-tight">suisensei</span>
            <span className="text-[11px] text-muted-foreground leading-tight">campiongerlie18@gmail.com</span>
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
            <AvatarFallback className="bg-emerald-500"></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">suisensei</span>
            <span className="text-xs text-muted-foreground">campiongerlie18@gmail.com</span>
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
        <DropdownMenuSeparator className="bg-[#343434]" />
        <DropdownMenuItem className="gap-2 p-2 rounded-[5px] text-red-500 hover:bg-red-500/10 cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}