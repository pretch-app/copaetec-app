"use client"

import dynamic from "next/dynamic"

export const Copa3D = dynamic(() => import("./copa-3d").then((mod) => mod.Copa3D), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none opacity-20">
      <div className="w-32 h-32 animate-pulse bg-primary/20 rounded-full blur-xl" />
    </div>
  )
})
