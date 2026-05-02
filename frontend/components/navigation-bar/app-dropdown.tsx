import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessagesSquare, Handshake, CodeXml, ChevronsUpDown } from "lucide-react";

export function AppDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 h-full p-0 px-2 rounded-none shadow-none transition-colors border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent"
        >
          {}
          <MessagesSquare className="w-8 h-8 text-foreground" />
          
          {}
          <span className="text-xl font-bold text-foreground tracking-tight">
            SyncTalk
          </span>
          
          <ChevronsUpDown className="w-5 h-5 text-muted-foreground ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-72 bg-[#1C1C1C] border border-[#343434] rounded-[5px] shadow-none p-1 mt-0" 
        align="start"
      >
        <DropdownMenuLabel className="flex flex-row items-start gap-3 p-3">
          <MessagesSquare className="w-6 h-6 text-foreground mt-1" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">SyncTalk</span>
            <span className="text-xs text-muted-foreground font-normal">
              A Real-Time Distributed Chat System
            </span>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-[#343434]" />
        
        <DropdownMenuItem className="gap-3 p-2 cursor-pointer rounded-[5px] hover:bg-white/5 transition-colors">
          <Handshake className="w-4 h-4" />
          <span className="text-sm">Terms and Conditions</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-3 p-2 cursor-pointer rounded-[5px] hover:bg-white/5 transition-colors">
          <CodeXml className="w-4 h-4" />
          <span className="text-sm">Meet the Developers</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}