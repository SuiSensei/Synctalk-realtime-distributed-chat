

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Share,
  Camera,
  Mail,
  PanelRightClose,
  Trash2,
  UserRoundX,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { usePresence } from "@/lib/hooks/use-presence";
import { getAvatarGradient } from "@/lib/utils/avatar";

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ url, id }: { url?: string; id: string }) {
  return (
    <div className="relative inline-block mt-6 ml-7">
      {url ? (
        <img src={url} alt="Avatar" className="w-[150px] h-[150px] rounded-full object-cover" />
      ) : (
        <div
          className={`w-[150px] h-[150px] rounded-full ${getAvatarGradient(id)}`}
        />
      )}
    </div>
  );
}

function CollapseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-[#2a2a2a] text-[#aaaaaa] hover:bg-[#333333] transition-colors"
      aria-label="Collapse sidebar"
    >
      <PanelRightClose size={18} />
    </button>
  );
}

function ProfileHeader({ profile, isOnline, onClose }: { profile: any; isOnline: boolean; onClose: () => void }) {
  const displayName = profile ? `${profile.first_name} ${profile.last_name}` : "Unknown User";

  return (
    <div className="relative pb-7 bg-[#1e1e1e]">
      <CollapseButton onClick={onClose} />
      <div className="relative inline-block">
        <Avatar url={profile?.avatar_url} id={profile?.id || "default"} />
        {isOnline && (
          <span className="absolute bottom-2 right-1 w-5 h-5 rounded-full bg-[#3ddc84] border-[3px] border-[#1e1e1e]" />
        )}
      </div>
      <h1
        className="mt-5 mx-7 font-geist font-bold text-white truncate"
        style={{ fontSize: "24px", letterSpacing: "-0.3px" }}
      >
        {displayName}
      </h1>
      <div className="flex items-center gap-2 mx-7 mt-2">
        <span className="font-geist text-[#888888]" style={{ fontSize: "13px" }}>
          Status
        </span>
        <Badge
          variant="outline"
          className={`font-geist rounded-full px-3 py-0 ${isOnline ? "border-[#3ddc84] text-[#3ddc84]" : "border-[#888888] text-[#888888]"}`}
          style={{ fontSize: "13px" }}
        >
          {isOnline ? "Online" : "Offline"}
        </Badge>
      </div>
    </div>
  );
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-7 py-6 bg-[#1e1e1e]">
      <p
        className="font-geist font-semibold text-white mb-2"
        style={{ fontSize: "16px" }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex items-center gap-2 px-4 py-[10px] rounded-xl bg-[#2a2a2a] border border-[#333333] text-white font-geist font-medium text-[14px] hover:bg-[#333333] transition-colors">
      {icon}
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfileSidebar({ userId, onClose }: { userId: string | null; onClose: () => void }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { onlineUsers } = usePresence();
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await supabase.from("profile").select("*").eq("id", userId).single();
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [userId, supabase]);

  if (!userId) return null;

  const isOnline = onlineUsers.some(u => u.id === userId);

  return (
    <div
      className="bg-[#141414] border-l border-[#2A2A2A] flex flex-col items-center justify-start p-6 font-geist overflow-y-auto custom-scrollbar"
      style={{ fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)" }}
    >
      {loading ? (
        <div className="w-[303px] h-full flex flex-col items-center animate-pulse gap-6">
          <div className="w-[150px] h-[150px] rounded-full bg-[#2a2a2a] mt-6" />
          <div className="w-48 h-8 bg-[#2a2a2a] rounded" />
          <div className="w-full h-32 bg-[#2a2a2a] rounded-2xl" />
        </div>
      ) : (
        <div className="w-[303px] bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] overflow-hidden flex flex-col shrink-0">
          <ProfileHeader profile={profile} isOnline={isOnline} onClose={onClose} />

          <Separator className="bg-[#2a2a2a]" />

          <InfoSection title="About">
            <p className="font-geist text-[#888888] leading-relaxed" style={{ fontSize: "13px" }}>
              {profile?.about || "No bio provided."}
            </p>
          </InfoSection>

          <Separator className="bg-[#2a2a2a]" />

          <InfoSection title="Contact">
            <p className="font-geist text-[#888888] mt-1" style={{ fontSize: "13px" }}>
              @{profile?.username}
            </p>
          </InfoSection>

          <Separator className="bg-[#2a2a2a]" />

          <div className="px-5 py-6 flex flex-col gap-3 bg-[#1e1e1e]">
            <Button
              variant="outline"
              className="w-full font-geist font-medium rounded-2xl border-[#7a2018] bg-transparent text-[#FF573D] hover:bg-[#FF573D]/5 hover:text-[#FF573D] py-4 h-auto gap-2"
              style={{ fontSize: "13px" }}
            >
              <UserRoundX size={16} />
              Unfriend
            </Button>
            <Button
              variant="outline"
              className="w-full font-geist font-medium rounded-2xl border-[#7a2018] bg-transparent text-[#FF573D] hover:bg-[#FF573D]/5 hover:text-[#FF573D] py-4 h-auto gap-2"
              style={{ fontSize: "13px" }}
            >
              <Trash2 size={16} />
              Delete Chat
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}