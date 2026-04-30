"use client";

import { UserDropdown } from "@/components/navigation-bar/user-dropdown";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <UserDropdown />
    </div>
  );
}
