"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoomableImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
}

export function ZoomableImage({ src, alt, className, priority }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div 
        className={cn("group relative w-full h-full cursor-pointer", className)}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white transform scale-50 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
            <ZoomIn className="h-6 w-6" />
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div 
            className="relative w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  )
}
