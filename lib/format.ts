export function formatDate(iso: string | null): string {
  if (!iso) return "Por definir"
  const d = new Date(iso)
  return d.toLocaleDateString("es-AR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  })
}

export function formatTime(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleTimeString("es-AR", { 
    hour: "2-digit", 
    minute: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires"
  })
}

export function teamInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}
