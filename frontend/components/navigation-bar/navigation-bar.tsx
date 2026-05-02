import { AppDropdown } from "./app-dropdown";
import { UserDropdown } from "./user-dropdown";

export function NavigationBar() {
  return (
    <nav className="flex items-stretch justify-between w-full max-w-7xl mx-auto h-15 px-2 py-0 bg-[#1C1C1C] border border-[#343434] rounded-[5px] shadow-none overflow-hidden">
      <AppDropdown />
      <UserDropdown />
    </nav>
  );
}