import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { TeamBadge } from "./team-badge"

vi.mock("next/image", () => ({
  default: () => null,
}))

describe("TeamBadge", () => {
  it("renders team initials when no badge image exists", () => {
    render(<TeamBadge name="Escuela Técnica" />)

    expect(screen.getByText("ET")).toBeInTheDocument()
  })
})
