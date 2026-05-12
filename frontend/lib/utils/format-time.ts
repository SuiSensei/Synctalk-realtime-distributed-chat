/**
 * formatRelativeTime
 * Takes an ISO string and returns a human-readable relative time.
 * E.g., "Just now", "5 mins", "2 hours", "1 day".
 */
export function formatRelativeTime(isoString: string | undefined | null): string {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 0) return "Just now"; // Handle slight future mismatches

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""}`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""}`;
  } else {
    // Return formatted date for older dates
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}
