import { describe, expect, it } from "vitest"
import { formatDate, formatTime, teamInitials } from "./format"

describe("format helpers", () => {
  it("returns a fallback when a date is not defined", () => {
    expect(formatDate(null)).toBe("Por definir")
    expect(formatTime(null)).toBe("")
  })

  it("formats dates and times in the tournament timezone", () => {
    expect(formatDate("2026-08-14T13:30:00Z")).toContain("14")
    expect(formatTime("2026-08-14T13:30:00Z")).toMatch(/^10:30/)
  })

  it("creates initials from the first two words", () => {
    expect(teamInitials("Escuela Técnica Nacional")).toBe("ET")
    expect(teamInitials("  etec  ")).toBe("E")
  })
})
