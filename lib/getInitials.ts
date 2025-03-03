export function getInitials(name: string): string {
  const words = name.split(" ").filter((word) => word.length > 0); // Split by spaces and remove empty strings
  return words.length >= 2 ? words[0][0] + words[1][0] : words[0][0] || "";
}
