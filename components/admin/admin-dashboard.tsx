"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  createTeamAction,
  updateTeamAction,
  deleteTeamAction,
  uploadTeamPhotoAction,
  uploadTeamEscudoAction,
  createPlayerAction,
  deletePlayerAction,
  createMatchAction,
  updateMatchResultAction,
  updateMatchExtrasAction,
  deleteMatchAction,
  addMatchEventAction,
  deleteMatchEventAction,
  uploadGalleryAction,
  deleteGalleryAction,
  createNewsAction,
  deleteNewsAction,
  deleteUserAction,
  autoGenerateGroupFixtureAction,
} from "@/app/admin/actions"
import { logoutAction } from "@/app/auth/actions"
import type { Team, Player, Match, MatchEvent, GalleryItem, TournamentSettings, NewsWithAuthor, User } from "@/lib/types"
import { TournamentConfig } from "@/components/admin/tournament-config"
import { MatchEditorCard } from "./match-editor-card"

type Props = {
  teams: Team[]
  players: Player[]
  matches: Match[]
  events: MatchEvent[]
  gallery: GalleryItem[]
  settings: TournamentSettings
  news: NewsWithAuthor[]
  users: User[]
}

function teamName(teams: Team[], id: number) {
  return teams.find((t) => t.id === id)?.name ?? "?"
}

function wrapAction(action: Function, successMessage: string) {
  return async (formData: FormData) => {
    try {
      const result = await action(formData)
      if (result?.error) {
        toast.error(result.error)
      } else if (result?.success || result === undefined) {
        // Fallback to success if result is undefined for older actions
        toast.success(successMessage)
      }
    } catch (e: any) {
      toast.error(e.message || "Ocurrió un error")
    }
  }
}

export function AdminDashboard({ teams, players, matches, events, gallery, settings, news, users }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">Administración</h1>
          <p className="text-sm text-muted-foreground">Panel de control del torneo</p>
        </div>
        <form action={logoutAction}>
          <Button variant="outline" type="submit">
            Cerrar sesión
          </Button>
        </form>
      </div>

      <Tabs defaultValue="settings" orientation="vertical" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex h-fit w-full flex-col justify-start md:w-64 md:shrink-0 bg-transparent p-0 gap-1 border-r border-border/50 pr-4">
          <TabsTrigger value="settings" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">⚙️ Configuración</TabsTrigger>
          <TabsTrigger value="matches" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">⚽ Partidos (Grupos)</TabsTrigger>
          <TabsTrigger value="knockouts" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">🏆 Llaves (Eliminatoria)</TabsTrigger>
          <TabsTrigger value="teams" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">👕 Equipos</TabsTrigger>
          <TabsTrigger value="players" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">👤 Jugadores</TabsTrigger>
          <TabsTrigger value="gallery" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">🖼️ Galería</TabsTrigger>
          <TabsTrigger value="news" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">📰 Noticias</TabsTrigger>
          <TabsTrigger value="users" className="w-full justify-start rounded-lg px-4 py-3 text-left font-medium text-muted-foreground transition-all hover:bg-secondary/50 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-bold data-[state=active]:shadow-sm">👥 Usuarios</TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="settings" className="m-0 focus-visible:outline-none">
            <TournamentConfig settings={settings} />
          </TabsContent>

          {/* MATCHES */}
          <TabsContent value="matches" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nuevo partido</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={wrapAction(createMatchAction, "Partido creado correctamente")} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="stage" value="group" />
                <div className="flex flex-col gap-1">
                  <Label>Fecha (jornada)</Label>
                  <Input name="matchday" type="number" min="1" defaultValue="1" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Horario</Label>
                  <Input name="kickoff" type="datetime-local" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Local</Label>
                  <select name="home_team_id" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Visitante</Label>
                  <select name="away_team_id" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Lugar</Label>
                  <Input name="venue" placeholder="Cancha 1" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Crear partido</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg text-primary">Generar Fixture Automáticamente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Genera todas las fechas de la fase de grupos (todos contra todos) basado en los grupos asignados a cada equipo. Los horarios y canchas quedarán vacíos para ser definidos luego.
              </p>
              <form action={async (formData) => {
                try {
                  const result = await autoGenerateGroupFixtureAction(formData)
                  if (result?.success) {
                    toast.success("Fixture generado con éxito")
                  }
                } catch (e: any) {
                  toast.error(e.message || "Ocurrió un error")
                }
              }} className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <input type="checkbox" id="double_round_robin" name="double_round_robin" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="double_round_robin" className="text-sm font-medium">Ida y vuelta (2 rondas)</label>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2">
                  <input type="checkbox" id="randomize" name="randomize" defaultChecked className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="randomize" className="text-sm font-medium">Mezclar orden de equipos aleatoriamente</label>
                </div>
                <div className="flex items-center space-x-2 sm:col-span-2 text-destructive">
                  <input type="checkbox" id="clear_existing" name="clear_existing" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="clear_existing" className="text-sm font-medium">Borrar partidos de fase de grupos existentes antes de generar</label>
                </div>
                <div className="sm:col-span-2 mt-2">
                  <Button type="submit" variant="default" onClick={(e) => {
                    const clear = (document.getElementById('clear_existing') as HTMLInputElement)?.checked;
                    if (clear && !confirm("¿Estás seguro que quieres BORRAR TODOS los partidos de la fase de grupos? Esta acción no se puede deshacer.")) {
                      e.preventDefault();
                    }
                  }}>
                    Generar Fixture
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {matches.filter(m => !m.stage || m.stage === "group").map((m) => (
            <MatchEditorCard key={m.id} match={m} teams={teams} players={players} events={events} />
          ))}
        </TabsContent>

        {/* KNOCKOUTS (LLAVES) */}
        <TabsContent value="knockouts" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
          <Card className="border-accent bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg text-accent-foreground">Generar Llaves Automáticamente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Basado en tu configuración ({settings.num_teams_advancing} equipos clasifican), esto emparejará automáticamente a los mejores equipos de la tabla (1º vs Último, 2º vs Penúltimo, etc.) y creará los partidos.
              </p>
              <form action={async (formData) => {
                const { autoGenerateBracketAction } = await import("@/app/admin/actions")
                try {
                  await autoGenerateBracketAction(formData)
                  toast.success("Llaves generadas con éxito")
                } catch (e: any) {
                  toast.error(e.message)
                }
              }}>
                <Button type="submit">Generar Llaves Automáticamente</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Agregar Partido Manualmente (opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={wrapAction(createMatchAction, "Partido de llaves creado")} className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <Label>Fase de Eliminatoria</Label>
                  <select name="stage" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required defaultValue="round_of_16">
                    <option value="round_of_16">Octavos de Final</option>
                    <option value="quarter_finals">Cuartos de Final</option>
                    <option value="semi_finals">Semifinal</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Fecha (jornada interna)</Label>
                  <Input name="matchday" type="number" min="1" defaultValue="100" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Horario</Label>
                  <Input name="kickoff" type="datetime-local" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Local</Label>
                  <select name="home_team_id" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Visitante</Label>
                  <select name="away_team_id" className="h-9 rounded-md border border-input bg-background px-3 text-sm" required>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Lugar</Label>
                  <Input name="venue" placeholder="Estadio Central" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Crear Partido de Llaves</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {matches.filter(m => m.stage && m.stage !== "group").map((m) => (
            <MatchEditorCard key={m.id} match={m} teams={teams} players={players} events={events} />
          ))}
        </TabsContent>

        {/* TEAMS */}
        <TabsContent value="teams" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nuevo equipo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                <strong>Fase de grupos:</strong> Si quieres que el torneo tenga fase de grupos, simplemente asígnale el nombre del grupo (ej. "A", "B") a los equipos. La tabla de posiciones se dividirá automáticamente. Si lo dejas vacío, formarán parte de la Tabla General.
              </p>
              <form action={wrapAction(createTeamAction, "Equipo creado")} className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <Label>Nombre</Label>
                  <Input name="name" required />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Capitán</Label>
                  <Input name="captain" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Grupo</Label>
                  <Input name="grupo" placeholder="A" />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit">Crear equipo</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {teams.map((t) => (
            <Card key={t.id}>
              <CardContent className="flex flex-col gap-4 pt-6">
                <form action={wrapAction(updateTeamAction, "Equipo actualizado")} className="grid gap-3 sm:grid-cols-3">
                  <input type="hidden" name="id" value={t.id} />
                  <div className="flex flex-col gap-1">
                    <Label>Nombre</Label>
                    <Input name="name" defaultValue={t.name} required />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Capitán</Label>
                    <Input name="captain" defaultValue={t.captain ?? ""} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Grupo</Label>
                    <Input name="grupo" defaultValue={t.grupo ?? ""} />
                  </div>
                  <div className="flex gap-2 sm:col-span-3">
                    <Button type="submit" size="sm">
                      Guardar
                    </Button>
                  </div>
                </form>
                <div className="flex flex-wrap items-center gap-3">
                  <form action={wrapAction(uploadTeamPhotoAction, "Foto subida")} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={t.id} />
                    <Input name="photo" type="file" accept="image/*" className="max-w-[200px]" required />
                    <Button type="submit" size="sm" variant="secondary">
                      Subir foto grupal
                    </Button>
                  </form>
                  <form action={wrapAction(uploadTeamEscudoAction, "Escudo subido")} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={t.id} />
                    <Input name="escudo" type="file" accept="image/*" className="max-w-[200px]" required />
                    <Button type="submit" size="sm" variant="secondary">
                      Subir escudo
                    </Button>
                  </form>
                  <form action={wrapAction(deleteTeamAction, "Equipo eliminado")} onSubmit={(e) => { if (!confirm("¿Eliminar este equipo? Se borrarán sus jugadores.")) e.preventDefault() }}>
                    <input type="hidden" name="id" value={t.id} />
                    <Button type="submit" size="sm" variant="ghost" className="text-destructive">
                      Eliminar equipo
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* PLAYERS */}
        <TabsContent value="players" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nuevo jugador</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={wrapAction(createPlayerAction, "Jugador agregado")} className="grid gap-3 sm:grid-cols-4">
                <div className="flex flex-col gap-1 sm:col-span-1">
                  <Label>Equipo</Label>
                  <select name="team_id" className="h-9 rounded-md border border-input bg-background px-2 text-sm" required>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Nombre</Label>
                  <Input name="name" required />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Número</Label>
                  <Input name="number" type="number" min="0" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Posición</Label>
                  <Input name="position" placeholder="Delantero" />
                </div>
                <div className="sm:col-span-4">
                  <Button type="submit">Agregar jugador</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {teams.map((t) => {
            const roster = players.filter((p) => p.team_id === t.id)
            return (
              <Card key={t.id}>
                <CardHeader>
                  <CardTitle className="text-base">{t.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-1">
                    {roster.map((p) => (
                      <li key={p.id} className="flex items-center justify-between text-sm">
                        <span>
                          {p.number ? `#${p.number} ` : ""}
                          {p.name}
                          {p.position ? ` — ${p.position}` : ""}
                        </span>
                        <form action={wrapAction(deletePlayerAction, "Jugador eliminado")}>
                          <input type="hidden" name="id" value={p.id} />
                          <Button variant="ghost" size="sm" type="submit" className="h-6 text-destructive">
                            Quitar
                          </Button>
                        </form>
                      </li>
                    ))}
                    {roster.length === 0 ? <li className="text-sm text-muted-foreground">Sin jugadores</li> : null}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        {/* GALLERY */}
        <TabsContent value="gallery" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subir foto</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={wrapAction(uploadGalleryAction, "Foto subida")} className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <Label>Imagen</Label>
                  <Input name="photo" type="file" accept="image/*" required />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Descripción</Label>
                  <Input name="caption" placeholder="Final del torneo" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit">Subir a galería</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-md border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.url || "/placeholder.svg"} alt={g.caption ?? "Foto"} className="aspect-square w-full object-cover" />
                <div className="flex items-center justify-between gap-1 p-2">
                  <span className="truncate text-xs text-muted-foreground">{g.caption ?? "Sin título"}</span>
                  <form action={wrapAction(deleteGalleryAction, "Foto eliminada")} onSubmit={(e) => { if (!confirm("¿Eliminar foto?")) e.preventDefault() }}>
                    <input type="hidden" name="id" value={g.id} />
                    <Button variant="ghost" size="sm" type="submit" className="h-6 text-destructive">
                      X
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* NEWS */}
        <TabsContent value="news" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Crear Noticia</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={wrapAction(createNewsAction, "Noticia creada exitosamente")} className="grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Título</Label>
                  <Input name="title" placeholder="Ej. ¡Inscripciones abiertas!" required />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Contenido (Descripción)</Label>
                  <Textarea name="content" rows={4} placeholder="Escribe el contenido de la noticia..." required />
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Color de Fondo</Label>
                  <select name="color" className="h-9 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="blue">Azul</option>
                    <option value="red">Rojo</option>
                    <option value="green">Verde</option>
                    <option value="yellow">Amarillo</option>
                    <option value="purple">Morado</option>
                    <option value="orange">Naranja</option>
                    <option value="slate">Gris Oscuro</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Link de YouTube (Opcional)</Label>
                  <Input name="youtube_url" type="url" placeholder="Ej: https://youtu.be/..." />
                  <p className="text-xs text-muted-foreground">Si pones un video, se usará su miniatura como portada automáticamente.</p>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label>Foto de Portada (Opcional si hay video)</Label>
                  <Input name="photo" type="file" accept="image/*" />
                </div>
                <div className="sm:col-span-2 mt-2">
                  <Button type="submit">Publicar Noticia</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {news.map((n) => (
              <Card key={n.id} className="overflow-hidden relative">
                {n.youtube_id && !n.image_url && (
                  <div className="relative h-48 w-full bg-black">
                    <img src={`https://img.youtube.com/vi/${n.youtube_id}/maxresdefault.jpg`} alt={n.title} className="h-full w-full object-cover opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>
                )}
                {n.image_url && (
                  <img src={n.image_url} alt={n.title} className="h-48 w-full object-cover" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl leading-tight">{n.title}</CardTitle>
                    <form action={wrapAction(deleteNewsAction, "Noticia eliminada")} onSubmit={(e) => { if (!confirm("¿Eliminar esta noticia?")) e.preventDefault() }}>
                      <input type="hidden" name="id" value={n.id} />
                      <Button variant="ghost" size="sm" type="submit" className="h-8 text-destructive px-2">
                        X
                      </Button>
                    </form>
                  </div>
                  <div className="text-xs text-muted-foreground flex gap-2">
                    <span>{new Date(n.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Color: {n.color}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm">{n.content}</p>
                </CardContent>
              </Card>
            ))}
            {news.length === 0 && (
              <p className="text-sm text-muted-foreground col-span-2">No hay noticias publicadas.</p>
            )}
            </div>
          </TabsContent>

          {/* USERS */}
          <TabsContent value="users" className="m-0 flex flex-col gap-6 focus-visible:outline-none">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gestión de Usuarios ({users.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-3 text-left font-medium">Nombre</th>
                          <th className="p-3 text-left font-medium">Email</th>
                          <th className="p-3 text-left font-medium">Rol</th>
                          <th className="p-3 text-right font-medium">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 font-medium">{u.display_name}</td>
                            <td className="p-3 text-muted-foreground">{u.email}</td>
                            <td className="p-3">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              {u.role !== 'admin' && (
                                <form action={wrapAction(deleteUserAction, "Usuario eliminado")} onSubmit={(e) => { if (!confirm(`¿Eliminar definitivamente a ${u.display_name}? Se borrarán también todos sus pronósticos.`)) e.preventDefault() }}>
                                  <input type="hidden" name="id" value={u.id} />
                                  <Button variant="destructive" size="sm" type="submit">
                                    Eliminar
                                  </Button>
                                </form>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}
