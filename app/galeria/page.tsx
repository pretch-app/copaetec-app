import { Camera, Image as ImageIcon } from "lucide-react"
import { getGallery } from "@/lib/queries"
import { PageHeader } from "@/components/page-header"
import { GalleryGrid } from "@/components/gallery-grid"



export default async function GaleriaPage() {
  const photos = await getGallery()

  return (
    <>
      <PageHeader 
        title="Galería" 
        subtitle="Los mejores momentos del torneo, fecha por fecha." 
        breadcrumbs={[{ label: "Galería" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-16">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-elevated/50 px-6 py-20 text-center animate-fade-up">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary shadow-sm">
                <Camera className="h-10 w-10" />
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border text-muted-foreground shadow-sm">
                  <ImageIcon className="h-4 w-4" />
                </div>
              </div>
            </div>
            <p className="font-display text-2xl font-bold">Todavía no hay fotos</p>
            <p className="mt-2 text-muted-foreground max-w-sm">
              Las postales de cada fecha irán apareciendo acá a medida que avance el torneo.
            </p>
          </div>
        ) : (
          <GalleryGrid photos={photos} />
        )}
      </div>
    </>
  )
}
