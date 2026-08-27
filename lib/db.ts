import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let sqlClient: NeonQueryFunction<false, false> | null = null

function getSql(): NeonQueryFunction<false, false> {
  if (sqlClient) return sqlClient

  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")

  sqlClient = neon(url)
  return sqlClient
}

// Defer the connection until a database-backed action or route is used.
export const sql = new Proxy((() => {}) as unknown as NeonQueryFunction<false, false>, {
  apply(_target, _thisArg, args: unknown[]) {
    return (getSql() as unknown as (...args: unknown[]) => unknown)(...args)
  },
  get(_target, prop, receiver) {
    return Reflect.get(getSql() as unknown as object, prop, receiver)
  },
}) as NeonQueryFunction<false, false>
