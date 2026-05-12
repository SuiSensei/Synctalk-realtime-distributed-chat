import { AppDropdown } from "./app-dropdown";
import { UserDropdown } from "./user-dropdown";
import { useWebSocket } from "@/lib/contexts/websocket-context";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const { isConnected } = useWebSocket();

  return (
    <nav className="flex items-stretch justify-between w-full h-15 px-2 py-0 bg-[#1C1C1C] border border-[#343434] rounded-[5px] shadow-none overflow-hidden relative">
      <div className="flex items-center gap-2">
        <AppDropdown />
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-emerald-500" : "bg-yellow-500 animate-pulse"
          )}
          title={isConnected ? "Connected" : "Reconnecting..."}
        />
      </div>
      <UserDropdown />
    </nav>
  );
}