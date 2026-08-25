import Image from "next/image"
import { teamInitials } from "@/lib/format"
import { cn } from "@/lib/utils"

export function TeamBadge({
  name,
  photoUrl,
  size = "md",
  className,
}: {
  name: string
  photoUrl?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-16 w-16 text-xl",
  }

  if (photoUrl) {
    return (
      <div className={cn("relative overflow-hidden rounded-full shadow-sm shrink-0 bg-secondary", sizes[size], className)}>
        <Image
          src={photoUrl || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 64px, 64px"
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-team-badge-bg font-display font-bold text-primary-foreground shadow-sm",
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {teamInitials(name)}
    </span>
  )
}
