import { getNewsById } from "@/lib/queries"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ZoomableImage } from "@/components/zoomable-image"
import { ArrowLeft, CalendarIcon, UserIcon } from "lucide-react"


export const revalidate = 60

export default async function NewsArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = await getNewsById(parseInt(id))
  
  if (!news) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/noticias" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Volver a noticias
      </Link>
      
      <article className="animate-fade-up">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground mb-4">
            <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full">
              <CalendarIcon className="h-4 w-4" />
              <time dateTime={news.created_at} suppressHydrationWarning>
                {new Date(news.created_at).toLocaleDateString("es-AR", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </time>
            </div>
            {news.author_name && (
              <div className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full">
                <UserIcon className="h-4 w-4" />
                <span>{news.author_name}</span>
              </div>
            )}
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            {news.title}
          </h1>
        </header>

        {/* Media (Video o Imagen) */}
        {news.youtube_id ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 border border-border shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${news.youtube_id}?autoplay=0&rel=0`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        ) : news.image_url ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl mb-10 border border-border shadow-lg">
            <ZoomableImage
              src={news.image_url}
              alt={news.title}
              priority
            />
          </div>
        ) : null}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {news.content}
        </div>
      </article>
    </main>
  )
}
