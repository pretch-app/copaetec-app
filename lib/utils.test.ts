import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
  it("combines classes and resolves conflicting Tailwind classes", () => {
    expect(cn("rounded", "px-2", false && "hidden", "px-4")).toBe("rounded px-4")
  })
})
