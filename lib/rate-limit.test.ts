import { describe, expect, it } from "vitest"
import { checkRateLimit } from "./rate-limit"

describe("checkRateLimit", () => {
  it("allows attempts until the configured limit", () => {
    const key = `test-${crypto.randomUUID()}`

    expect(checkRateLimit(key, 2, 60_000)).toMatchObject({ allowed: true, remaining: 1 })
    expect(checkRateLimit(key, 2, 60_000)).toMatchObject({ allowed: true, remaining: 0 })
    expect(checkRateLimit(key, 2, 60_000)).toMatchObject({ allowed: false, remaining: 0 })
  })
})
