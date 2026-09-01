const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/+$/, "")

export function apiUrl(path: string) {
  return `${API_URL}${path}`
}

// Para Server Components: trae datos públicos del backend (sin cookies de sesión).
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(apiUrl(path), { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`API ${path} respondió ${res.status}`)
  }
  return res.json() as Promise<T>
}

// Igual que apiGet pero devuelve null en 404 en vez de lanzar.
export async function apiGetOrNull<T>(path: string): Promise<T | null> {
  const res = await fetch(apiUrl(path), { cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`API ${path} respondió ${res.status}`)
  }
  return res.json() as Promise<T>
}
