import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"
import { apiClient, getMe } from "./api-client"
import { apiGet, apiGetOrNull } from "./api"
import { server } from "../test/server"

describe("API client integration", () => {
  it("gets public data through the server API helper", async () => {
    server.use(
      http.get("http://localhost:4000/api/teams", () =>
        HttpResponse.json({ teams: [{ id: 1, name: "Etec" }] }),
      ),
    )

    await expect(apiGet<{ teams: { id: number; name: string }[] }>("/api/teams")).resolves.toEqual({
      teams: [{ id: 1, name: "Etec" }],
    })
  })

  it("turns a public 404 into null when requested", async () => {
    server.use(
      http.get("http://localhost:4000/api/teams/missing", () =>
        new HttpResponse(null, { status: 404 }),
      ),
    )

    await expect(apiGetOrNull("/api/teams/missing")).resolves.toBeNull()
  })

  it("sends authenticated JSON requests and returns the API result", async () => {
    server.use(
      http.post("http://localhost:4000/api/predictions", async ({ request }) => {
        const body = (await request.json()) as { match_id: number }
        expect(body).toEqual({ match_id: 42 })
        return HttpResponse.json({ saved: true })
      }),
    )

    await expect(apiClient<{ saved: boolean }>("/api/predictions", {
      method: "POST",
      body: { match_id: 42 },
    })).resolves.toEqual({ ok: true, data: { saved: true } })
  })

  it("normalizes API errors without throwing", async () => {
    server.use(
      http.get("http://localhost:4000/api/auth/me", () =>
        HttpResponse.json({ error: "No autorizado" }, { status: 401 }),
      ),
    )

    await expect(getMe()).resolves.toBeNull()
  })
})
