import { getAllNews } from "@/lib/queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, UserIcon, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"


export const revalidate = 60

export const metadata = {
  title: "Noticias | Copa ETec",
  description: "Últimas novedades y anuncios del torneo.",
}

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
  blue: "bg-blue-600 text-white",
  red: "bg-red-600 text-white",
  green: "bg-green-600 text-white",
  yellow: "bg-yellow-500 text-black",
  purple: "bg-purple-600 text-white",
  orange: "bg-orange-600 text-white",
  slate: "bg-slate-700 text-white",
}

export default async function NoticiasPage() {
  const news = await getAllNews()

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight text-primary sm:text-5xl">
          Noticias
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Enterate de las últimas novedades, anuncios y comunicados oficiales.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {news.map((item) => {
          const cardClass = colorMap[item.color] || colorMap.blue
          const badgeClass = badgeMap[item.color] || badgeMap.blue
          
          return (
            <Link key={item.id} href={`/noticias/${item.id}`} className="block group h-full">
              <Card className={`h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${cardClass} backdrop-blur-sm flex flex-col`}>
                {(item.image_url || item.youtube_id) && (
                  <div className="relative aspect-video w-full overflow-hidden shrink-0 bg-black">
                    <Image
                      src={item.image_url || `https://img.youtube.com/vi/${item.youtube_id}/maxresdefault.jpg`}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!item.image_url && item.youtube_id ? 'opacity-80' : ''}`}
                      unoptimized={!item.image_url && !!item.youtube_id} // Youtube image domain might not be in next.config
                    />
                    {!item.image_url && item.youtube_id && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-1"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                )}
                
                <CardHeader className="relative pb-2 pt-6 shrink-0">
                  {!(item.image_url || item.youtube_id) && (
                    <div className={`absolute top-0 left-0 h-1.5 w-full ${badgeClass}`} />
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-full border border-border">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <time dateTime={item.created_at} suppressHydrationWarning>
                        {new Date(item.created_at).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </time>
                    </div>
                    {item.author_name && (
                      <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-full border border-border">
                        <UserIcon className="h-3.5 w-3.5" />
                        <span>{item.author_name}</span>
                      </div>
                    )}
                  </div>
                  
                  <CardTitle className="font-display text-2xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-2 flex-grow flex flex-col justify-between">
                  <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/80 whitespace-pre-wrap break-words leading-relaxed line-clamp-3 mb-4">
                    {item.content}
                  </div>
                  <span className="text-sm font-semibold text-primary mt-auto inline-flex items-center">
                    Leer más <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}

        {news.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <CalendarIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold">No hay noticias todavía</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Por el momento no hay comunicados publicados. Vuelve a revisar más tarde para enterarte de las novedades.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
