

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar() {
  return (
    <div className="relative inline-block mt-6 ml-7">
      {/* Circle with mixed radial gradient #FF573D → #993424 */}
      <div
        className="w-[150px] h-[150px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 38% 30%, #FF573D 0%, #d03525 50%, #993424 100%)",
        }}
      />
      {/* Online dot */}
      <span
        className="absolute bottom-2 right-1 w-5 h-5 rounded-full bg-[#3ddc84] border-[3px] border-[#1e1e1e]"
      />
    </div>
  );
}

function CollapseButton() {
  return (
    <button
      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-xl bg-[#2a2a2a] text-[#aaaaaa] hover:bg-[#333333] transition-colors"
      aria-label="Collapse sidebar"
    >
      <PanelRightClose size={18} />
    </button>
  );
}

function ProfileHeader() {
  return (
    <div className="relative pb-7 bg-[#1e1e1e]">
      <CollapseButton />
      <Avatar />
      {/* Name */}
      <h1
        className="mt-5 mx-7 font-geist font-bold text-white"
        style={{ fontSize: "24px", letterSpacing: "-0.3px" }}
      >
        Jhey Gulde
      </h1>
      {/* Last Seen */}
      <div className="flex items-center gap-2 mx-7 mt-2">
        <span
          className="font-geist text-[#888888]"
          style={{ fontSize: "13px" }}
        >
          Last Seen
        </span>
        <Badge
          variant="outline"
          className="font-geist rounded-full border-[#3ddc84] text-[#3ddc84] bg-transparent px-3 py-0"
          style={{ fontSize: "13px" }}
        >
          Now
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

export default function ProfileSidebar() {
  return (
    // Outer page: pure black bg, flex row
    <div
      className="min-h-screen bg-black flex items-start justify-center gap-6 p-10 font-geist"
      style={{ fontFamily: "var(--font-geist-sans, 'Geist', sans-serif)" }}
    >
      {/* View Profile button — floats left of card */}
      <Button
        variant="secondary"
        className="mt-1 flex items-center gap-2 rounded-2xl bg-[#1c1c1c] hover:bg-[#2a2a2a] text-white font-geist font-medium text-[14px] border border-[#2a2a2a] px-5 py-3 h-auto"
      >
        <User size={17} />
        View Profile
      </Button>

      {/* Profile card */}
      <div className="w-[303px] bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] overflow-hidden flex flex-col">

        {/* Header */}
        <ProfileHeader />

        <Separator className="bg-[#2a2a2a]" />

        {/* About */}
        <InfoSection title="About">
          <p
            className="font-geist text-[#888888] leading-relaxed"
            style={{ fontSize: "13px" }}
          >
            I love reading, traveling and discovering new things. You need to be
            happy in life.
          </p>
        </InfoSection>

        <Separator className="bg-[#2a2a2a]" />

        {/* Phone Number */}
        <InfoSection title="Phone Number">
          <p
            className="font-geist text-[#888888] mt-1"
            style={{ fontSize: "13px" }}
          >
            536-159-0405
          </p>
        </InfoSection>

        <Separator className="bg-[#2a2a2a]" />

        {/* Location */}
        <InfoSection title="Location">
          <div className="flex items-center gap-3 mt-1">
            <span
              className="font-geist text-[#888888]"
              style={{ fontSize: "13px" }}
            >
              Philippines
            </span>
            <Badge
              variant="outline"
              className="font-geist rounded-full border-[#FF573D] text-[#FF573D] bg-transparent px-3 py-0"
              style={{ fontSize: "13px" }}
            >
              Partial Location
            </Badge>
          </div>
        </InfoSection>

        <Separator className="bg-[#2a2a2a]" />

        {/* Social Links */}
        <InfoSection title="Social Links">
          <div className="flex flex-wrap gap-[10px] mt-2">
            <SocialButton
              icon={<Share size={17} />}
              label="Facebook"
            />
            <SocialButton
              icon={<Mail size={17} />}
              label="Email"
            />
            <SocialButton
              icon={<Camera size={17} />}
              label="Instagram"
            />
          </div>
        </InfoSection>

        {/* Spacer */}
        <div className="flex-1 min-h-[90px] bg-[#1e1e1e]" />

        {/* Action Buttons */}
        <div className="px-5 pb-6 flex flex-col gap-3 bg-[#1e1e1e]">
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
    </div>
  );
}