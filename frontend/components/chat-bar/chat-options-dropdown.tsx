"use client";
import { MoreHorizontal, Ban, Trash2, UserRound } from "lucide-react";
import { LucideIcon } from "lucide-react"

function OptionItem({ icon: Icon, label, danger }: 
    { icon: LucideIcon; label: string; danger?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 20px",
        cursor: "pointer",
        borderRadius: 10,
        transition: "background 0.12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#2e2e36")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Icon
        size={22}
        color={danger ? "#e05252" : "#c4c4d4"}
        strokeWidth={1.6}
      />
      <span
        style={{
          fontSize: 17,
          fontWeight: 500,
          color: danger ? "#e05252" : "#f0f0f5",
          fontFamily: "'Geist', sans-serif",
          letterSpacing: "-0.2px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ChatOptions() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div
        style={{
          fontFamily: "'Geist', sans-serif",
          background: "#000",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 340 }}>
          {/* Trigger button */}
          <div
            style={{
              width: 52,
              height: 52,
              background: "#1e1e26",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginBottom: 10,
              marginLeft: 4,
            }}
          >
            <MoreHorizontal size={20} color="#f0f0f5" strokeWidth={2} />
          </div>

          {/* Dropdown */}
          <div
            style={{
              background: "#23232d",
              borderRadius: 16,
              padding: "6px 8px",
              width: "100%",
            }}
          >
            <OptionItem icon={Ban} label="Block" danger />
            <OptionItem icon={Trash2} label="Delete" danger />
            <OptionItem icon={UserRound} label="Archive" danger={false} />
          </div>
        </div>
      </div>
    </>
  );
}