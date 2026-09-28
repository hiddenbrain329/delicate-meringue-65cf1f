export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00Z" : ""));
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}
