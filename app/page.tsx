import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarDays, Trophy, Target, Users, PlayCircle } from "lucide-react"
import { getMatches, getStandings, getTopScorers, getTournamentStats, getTournamentSettings, getAllNews } from "@/lib/queries"
import { MatchCard } from "@/components/match-card"
import { StandingsTable } from "@/components/standings-table"
import { TeamBadge } from "@/components/team-badge"
import { Copa3D } from "@/components/copa-3d-wrapper"
import { AnimatedCounter } from "@/components/animated-counter"
import { CountdownTimer } from "@/components/countdown-timer"
import { HeroParticlesWrapper } from "@/components/hero-particles-wrapper"
import { cn } from "@/lib/utils"



export default async function HomePage() {
  const [matches, standings, scorers, stats, settings, news] = await Promise.all([
    getMatches(),
    getStandings(),
    getTopScorers(5),
    getTournamentStats(),
    getTournamentSettings(),
    getAllNews(),
  ])

  const upcoming = matches.filter((m) => m.status === "scheduled").slice(0, 4)
  const latestNews = news.slice(0, 2)
  const isLive = false // Could check if any match is currently ongoing based on kickoff time

  return (
    <div>
      {/* Hero - Epic Stadium Design */}
      <section className="relative overflow-hidden bg-background text-foreground min-h-[100dvh] flex flex-col justify-center">
        {/* Deep dark base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-background to-background" />
        
        {/* Main spotlight cone from above - focused on trophy */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[80vh] pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(255,170,0,0.08) 0%, rgba(255,170,0,0.02) 40%, transparent 100%)',
          clipPath: 'polygon(40% 0%, 60% 0%, 85% 100%, 15% 100%)',
        }} />
        
        {/* Secondary spotlights - left and right */}
        <div className="absolute top-0 left-[20%] w-[300px] h-[70vh] pointer-events-none opacity-60 animate-[spotlight-left_8s_ease-in-out_infinite]" style={{
          background: 'linear-gradient(180deg, rgba(100,149,237,0.1) 0%, transparent 80%)',
          clipPath: 'polygon(35% 0%, 65% 0%, 90% 100%, 10% 100%)',
        }} />
        <div className="absolute top-0 right-[20%] w-[300px] h-[70vh] pointer-events-none opacity-60 animate-[spotlight-right_10s_ease-in-out_infinite_2s]" style={{
          background: 'linear-gradient(180deg, rgba(100,149,237,0.1) 0%, transparent 80%)',
          clipPath: 'polygon(35% 0%, 65% 0%, 90% 100%, 10% 100%)',
        }} />
        
        {/* Ambient glow - very subtle */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/3 blur-[200px] rounded-full animate-[pulse-glow_8s_ease-in-out_infinite] pointer-events-none" />
        
        {/* Light beams - thinner, more subtle */}
        <div className="absolute top-0 left-[18%] w-px h-full bg-gradient-to-b from-accent/15 via-accent/3 to-transparent pointer-events-none animate-[beam-fade_5s_ease-in-out_infinite]" />
        <div className="absolute top-0 right-[22%] w-px h-full bg-gradient-to-b from-accent/10 via-accent/2 to-transparent pointer-events-none animate-[beam-fade_6s_ease-in-out_infinite_1.5s]" />
        <div className="absolute top-0 left-[42%] w-px h-[60%] bg-gradient-to-b from-primary/8 to-transparent pointer-events-none animate-[beam-fade_4s_ease-in-out_infinite_0.5s]" />
        <div className="absolute top-0 right-[38%] w-px h-[60%] bg-gradient-to-b from-primary/8 to-transparent pointer-events-none animate-[beam-fade_4.5s_ease-in-out_infinite_2s]" />
        
        {/* Radial gradient overlay - warm from top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,rgba(255,215,0,0.06),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,oklch(0.12_0.02_250/80%),transparent)] pointer-events-none" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_30%,#000_30%,transparent_100%)] pointer-events-none" />
        
        {/* Floating particles */}
        <HeroParticlesWrapper />
        
        {/* Top lens flare */}
        <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-amber-400/8 blur-3xl animate-[pulse-glow_4s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute top-[2%] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-300/50 blur-[2px] animate-[star-twinkle_3s_ease-in-out_infinite] pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-16 flex flex-col items-center text-center z-10">

          {/* Trophy showcase area */}
          <div className="relative flex justify-center w-full max-w-4xl animate-fade-up delay-200">
             
             {/* Golden glow ring behind trophy */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full border border-amber-400/10 animate-[pulse-glow_4s_ease-in-out_infinite] pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[520px] sm:h-[520px] rounded-full border border-amber-400/5 animate-[pulse-glow_6s_ease-in-out_infinite_1s] pointer-events-none" />
             
             {/* Concentrated warm glow behind trophy */}
             <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[400px] sm:h-[350px] bg-amber-600/10 blur-[100px] rounded-full animate-[pulse-glow_5s_ease-in-out_infinite] pointer-events-none" />
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] sm:w-[280px] sm:h-[280px] bg-amber-500/6 blur-[80px] rounded-full animate-[pulse-glow_7s_ease-in-out_infinite_1s] pointer-events-none" />
             
             {/* The trophy */}
             <div className="transform transition-transform duration-1000 hover:scale-105 z-10 relative">
               <Copa3D className="w-72 h-80 sm:w-[550px] sm:h-[600px] drop-shadow-[0_10px_60px_rgba(234,179,8,0.25)]" />
             </div>
             
             {/* Reflective stage floor */}
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[60px] sm:h-[80px] pointer-events-none" style={{
               background: 'radial-gradient(ellipse at 50% 0%, rgba(234,179,8,0.15) 0%, rgba(234,179,8,0.05) 40%, transparent 70%)',
             }} />
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[200px] sm:w-[350px] h-[2px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />
          </div>
          
          {/* Title area - overlaps trophy slightly for depth */}
          <div className="max-w-5xl mx-auto -mt-16 sm:-mt-32 md:-mt-44 relative z-20 animate-fade-up delay-300">
            <h1 className="font-display text-5xl sm:text-7xl md:text-[8rem] lg:text-[9rem] font-bold leading-[0.9] tracking-tight text-balance" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
              {(settings.tournament_name || "Copa ETec 2026").split(" ").map((word, i, arr) => 
                i === arr.length - 1 ? <span key={i} className="text-gradient-gold block mt-2">{word}</span> : <span key={i}>{word} </span>
              )}
            </h1>
            
            <p className="mt-8 max-w-2xl text-base sm:text-lg text-foreground/70 text-pretty mx-auto font-medium">
              Seguí todo el torneo en un solo lugar: fixture, resultados en vivo, tabla de posiciones,
              goleadores y las mejores fotos de cada fecha.
            </p>
            
            {/* Countdown Timer */}
            <div className="mt-8 animate-fade-up delay-400">
              <CountdownTimer />
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-5 animate-fade-up delay-500">
              <Link
                href="/fixture"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:scale-110 shadow-[0_0_30px_oklch(var(--primary)/40%)] hover:shadow-[0_0_50px_oklch(var(--primary)/60%)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
              >
                <CalendarDays className="h-6 w-6" /> Ver fixture
              </Link>
              <Link
                href="/posiciones"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-border bg-surface-elevated/80 backdrop-blur-md px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg font-bold transition-all duration-300 hover:bg-surface-elevated hover:border-primary/50 hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-border"
              >
                Tabla de posiciones <ArrowRight className="h-6 w-6 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
        
        {/* Bottom fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-20" />
      </section>

      {/* Stats strip with glassmorphism */}
      <section className="relative z-20 -mt-8 mx-auto max-w-5xl px-4 animate-fade-up delay-400">
        <div className="grid grid-cols-2 gap-px sm:grid-cols-4 rounded-2xl overflow-hidden border border-border shadow-xl bg-border glass-card">
          <StatItem icon={Users} label="Equipos" value={<AnimatedCounter value={standings.length} />} />
          <StatItem icon={PlayCircle} label="Partidos jugados" value={<AnimatedCounter value={stats.totalMatches} />} />
          <StatItem icon={Target} label="Goles totales" value={<AnimatedCounter value={stats.totalGoals} />} />
          <StatItem icon={Trophy} label="Goles por partido" value={stats.avgGoalsPerMatch} />
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left: upcoming + standings */}
          <div className="space-y-16 lg:col-span-2">
            
            {latestNews.length > 0 && (
              <section className="scroll-mt-24">
                <SectionHeader title="Últimas Noticias" href="/noticias" linkLabel="Ver todas las noticias" />
                <div className="grid gap-4 sm:grid-cols-2 mt-6">
                  {latestNews.map((n, i) => {
                    const colorMap: Record<string, string> = {
                      blue: "bg-blue-600/10 border-blue-500/30",
                      red: "bg-red-600/10 border-red-500/30",
                      green: "bg-green-600/10 border-green-500/30",
                      yellow: "bg-yellow-500/10 border-yellow-500/30",
                      purple: "bg-purple-600/10 border-purple-500/30",
                      orange: "bg-orange-600/10 border-orange-500/30",
                      slate: "bg-slate-600/10 border-slate-500/30",
                    }
                    const badgeMap: Record<string, string> = {
                      blue: "bg-blue-600",
                      red: "bg-red-600",
                      green: "bg-green-600",
                      yellow: "bg-yellow-500",
                      purple: "bg-purple-600",
                      orange: "bg-orange-600",
                      slate: "bg-slate-700",
                    }
                    const cardClass = colorMap[n.color] || colorMap.blue
                    const badgeClass = badgeMap[n.color] || badgeMap.blue

                    return (
                      <Link key={n.id} href="/noticias" className={`group relative flex flex-col overflow-hidden rounded-2xl border ${cardClass} backdrop-blur-sm transition-all hover:shadow-lg hover:-translate-y-1 animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                        {n.image_url && (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image src={n.image_url} alt={n.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-5 relative">
                          {!n.image_url && (
                            <div className={`absolute top-0 left-0 h-1 w-full ${badgeClass}`} />
                          )}
                          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2 mt-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <time suppressHydrationWarning>{new Date(n.created_at).toLocaleDateString("es-AR")}</time>
                          </div>
                          <h3 className="font-display text-xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{n.title}</h3>
                          <p className="text-sm text-foreground/80 break-words line-clamp-2 mt-auto">{n.content}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <Divider />
              </section>
            )}

            <section className="scroll-mt-24">
              <SectionHeader title="Próximos partidos" href="/fixture" linkLabel="Ver fixture completo" />
              {upcoming.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 mt-6">
                  {upcoming.map((m, i) => (
                    <div key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                      <MatchCard match={m} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-border bg-surface-elevated/50 p-8 text-center animate-fade-up">
                  <CalendarDays className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No hay partidos programados por el momento.</p>
                </div>
              )}
            </section>

            <Divider />

            <section className="scroll-mt-24">
              <SectionHeader title="Tabla de posiciones" href="/posiciones" linkLabel="Ver tabla completa" />
              <div className="mt-6 animate-fade-up">
                <StandingsTable rows={standings.slice(0, 8)} compact />
              </div>
            </section>
          </div>

          {/* Right: top scorers */}
          <div className="space-y-8">
            <section className="scroll-mt-24 sticky top-24">
              <SectionHeader title="Top Goleadores" href="/estadisticas" linkLabel="Ver ranking" />
              <div className="mt-6 rounded-2xl border border-border bg-surface-elevated shadow-sm overflow-hidden animate-slide-in-right">
                {scorers.length > 0 ? (
                  <ol>
                    {scorers.map((s, i) => (
                      <li
                        key={`${s.scorer_name}-${s.team_slug}`}
                        className="group relative flex items-center gap-4 border-b border-border px-5 py-4 last:border-0 hover:bg-secondary/40 transition-colors"
                      >
                        <span className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold shadow-sm transition-transform group-hover:scale-110",
                          i === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-950" :
                          i === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-950" :
                          i === 2 ? "bg-gradient-to-br from-orange-400 to-orange-700 text-orange-950" :
                          "bg-secondary text-secondary-foreground"
                        )}>
                          {i + 1}
                        </span>
                        
                        <TeamBadge name={s.team_name} size="sm" className="shadow-sm" />
                        
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold group-hover:text-primary transition-colors">{s.scorer_name}</p>
                          <p className="truncate text-xs text-muted-foreground font-medium">{s.team_name}</p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <span className="font-display text-2xl font-bold text-primary group-hover:scale-110 transition-transform origin-right">{s.goals}</span>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Goles</span>
                        </div>
                        
                        {/* Interactive hover progress bar background */}
                        <div 
                          className="absolute bottom-0 left-0 h-0.5 bg-primary/20 transition-all duration-500 ease-out w-0 group-hover:w-full" 
                        />
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="p-8 text-center">
                    <Target className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium text-muted-foreground">Aún no hay goles registrados.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="group flex flex-col items-center justify-center gap-3 bg-surface-elevated/80 px-4 py-8 transition-colors hover:bg-surface-elevated">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-md group-hover:shadow-primary/20">
        <Icon className="h-6 w-6" />
      </span>
      <div className="text-center">
        <p className="font-display text-3xl font-bold leading-none tabular-nums tracking-tight">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}

function SectionHeader({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-2 rounded-full bg-primary" />
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      <Link 
        href={href} 
        className="group flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80 bg-primary/10 px-4 py-2 rounded-full"
      >
        {linkLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}

function Divider() {
  return (
    <div className="py-8 flex items-center justify-center opacity-20">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-foreground to-transparent" />
      <Target className="h-4 w-4 mx-4 shrink-0 text-foreground" />
      <div className="h-px w-full bg-gradient-to-r from-foreground via-transparent to-transparent" />
    </div>
  )
}
