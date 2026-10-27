export function parseApiDate(value) {
  if (!value) return null;

  const normalized = String(value).replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function timeAgo(value) {
  const date = parseApiDate(value);

  if (!date) return "";

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
