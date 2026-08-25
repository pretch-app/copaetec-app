"use client"

import dynamic from "next/dynamic"

const HeroParticles = dynamic(() => import("./hero-particles").then(m => ({ default: m.HeroParticles })), {
  ssr: false,
})

export function HeroParticlesWrapper() {
  return <HeroParticles />
}
