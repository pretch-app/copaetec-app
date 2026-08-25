import { redirect } from "next/navigation"

export default function RegisterPage() {
  // El registro ahora se maneja automáticamente con Google en la pantalla de Login
  redirect("/auth/login")
}
