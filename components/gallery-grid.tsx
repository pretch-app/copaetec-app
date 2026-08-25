"use client"

import { useState } from "react"
import Image from "next/image"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { GalleryItem } from "@/lib/types"

export function GalleryGrid({ photos }: { photos: GalleryItem[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1)
    }
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1)
    }
  }

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:mb-6">
        {photos.map((photo, i) => (
          <figure
            key={photo.id}
            className="group break-inside-avoid relative overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-sm cursor-pointer animate-fade-up transition-all hover:shadow-lg hover:-translate-y-1"
            style={{ animationDelay: `${(i % 10) * 50}ms` }}
            onClick={() => setSelectedPhoto(i)}
          >
            <div className="relative w-full" style={{ paddingBottom: '100%' }}> {/* Fallback aspect ratio */}
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={photo.caption ?? "Foto del torneo"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform scale-50 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                  <ZoomIn className="h-6 w-6" />
                </div>
              </div>
            </div>
            
            {photo.caption && (
              <figcaption className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-8 text-sm font-medium text-white translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Cerrar"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
            {selectedPhoto > 0 && (
              <button 
                className="absolute left-0 sm:left-4 text-white/70 hover:text-white p-2 sm:p-4 rounded-full hover:bg-white/10 transition-colors z-10"
                onClick={handlePrev}
                aria-label="Anterior"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
            )}

            <div 
              className="relative w-full max-h-[80vh] h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={photos[selectedPhoto].url}
                  alt={photos[selectedPhoto].caption ?? "Foto en grande"}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
              
              {photos[selectedPhoto].caption && (
                <p className="mt-4 text-center text-white/90 bg-black/50 px-6 py-2 rounded-full text-sm font-medium backdrop-blur-md">
                  {photos[selectedPhoto].caption}
                </p>
              )}
            </div>

            {selectedPhoto < photos.length - 1 && (
              <button 
                className="absolute right-0 sm:right-4 text-white/70 hover:text-white p-2 sm:p-4 rounded-full hover:bg-white/10 transition-colors z-10"
                onClick={handleNext}
                aria-label="Siguiente"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
