/**
 * getAvatarGradient
 * Takes an ID (like a user ID or room ID) and returns a deterministic
 * Tailwind CSS gradient class string to use as an avatar background.
 */
export function getAvatarGradient(id: string | undefined | null): string {
  if (!id) return "bg-gradient-to-b from-[#343434] to-[#1A1A1A]";

  // Hash the ID to an integer
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Pre-defined pleasing gradients that match the dark theme
  const gradients = [
    "bg-gradient-to-b from-[#E04F38] to-[#B33522]", // Red
    "bg-gradient-to-b from-[#00B4D8] to-[#008BA6]", // Blue
    "bg-gradient-to-b from-[#80C868] to-[#5C9B47]", // Green
    "bg-gradient-to-b from-[#AA00FF] to-[#7B00B8]", // Purple
    "bg-gradient-to-b from-[#D4A33B] to-[#9E7828]", // Yellow/Gold
    "bg-gradient-to-b from-[#5B48E4] to-[#3B2BA6]", // Indigo
    "bg-gradient-to-b from-[#C84B9C] to-[#943171]", // Pink
    "bg-gradient-to-b from-[#38D4B0] to-[#259C80]", // Teal
  ];

  // Pick one deterministically
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
