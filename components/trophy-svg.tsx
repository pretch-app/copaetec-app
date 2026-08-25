"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

export function TrophySVG({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Intense background glow */}
      <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] rounded-full animate-pulse-glow" />
      
      {/* Epic rotating light beams behind the trophy */}
      <div className="absolute inset-[-50%] opacity-30 animate-[spin_20s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(253, 224, 71, 0.4) 10deg, transparent 20deg, transparent 90deg, rgba(253, 224, 71, 0.4) 100deg, transparent 110deg, transparent 180deg, rgba(253, 224, 71, 0.4) 190deg, transparent 200deg, transparent 270deg, rgba(253, 224, 71, 0.4) 280deg, transparent 290deg)' }} />

      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "relative z-10 w-full h-full drop-shadow-[0_20px_40px_rgba(234,179,8,0.3)] transition-all duration-1000",
          mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-20 scale-90",
          "animate-[trophy-float_6s_ease-in-out_infinite]"
        )}
        style={{ filter: "drop-shadow(0 0 30px rgba(234, 179, 8, 0.4))" }}
      >
        <defs>
          {/* Main Gold Gradient */}
          <linearGradient id="epicGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="15%" stopColor="#ca8a04" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>

          {/* Silver/Steel Gradient for details */}
          <linearGradient id="epicSilver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          {/* Dark Shadow Gradient */}
          <linearGradient id="innerShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.6)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </linearGradient>
          
          <radialGradient id="ballGlow" cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#a16207" />
          </radialGradient>
        </defs>

        {/* --- BASE --- */}
        {/* Bottom Tier */}
        <path d="M80 460 L320 460 L330 490 C330 495 320 500 200 500 C80 500 70 495 70 490 Z" fill="url(#epicGold)" />
        <path d="M80 460 L320 460 L330 490 C330 495 320 500 200 500 C80 500 70 495 70 490 Z" fill="url(#innerShadow)" opacity="0.5" />
        
        {/* Middle Tier Base */}
        <path d="M100 410 L300 410 L320 460 L80 460 Z" fill="url(#epicGold)" />
        {/* Base decorative lines */}
        <path d="M110 420 L290 420 M90 450 L310 450" stroke="#713f12" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

        {/* Stem Base */}
        <path d="M130 360 L270 360 L300 410 L100 410 Z" fill="url(#epicSilver)" />
        
        {/* Stem */}
        <path d="M160 250 C160 300 130 340 130 360 L270 360 C270 340 240 300 240 250 Z" fill="url(#epicGold)" />
        {/* Stem Ribs */}
        <path d="M170 260 Q170 320 150 350 M200 260 Q200 320 200 355 M230 260 Q230 320 250 350" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" opacity="0.7" />

        {/* --- HANDLES --- */}
        {/* Left Handle */}
        <path d="M130 130 C30 130 10 220 50 280 C80 320 140 280 150 260" stroke="url(#epicGold)" strokeWidth="24" strokeLinecap="round" fill="none" />
        <path d="M130 130 C30 130 10 220 50 280 C80 320 140 280 150 260" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
        
        {/* Right Handle */}
        <path d="M270 130 C370 130 390 220 350 280 C320 320 260 280 250 260" stroke="url(#epicGold)" strokeWidth="24" strokeLinecap="round" fill="none" />
        <path d="M270 130 C370 130 390 220 350 280 C320 320 260 280 250 260" stroke="#fef08a" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* --- MAIN CUP BODY --- */}
        <path d="M100 80 C100 180 140 260 200 260 C260 260 300 180 300 80 Z" fill="url(#epicGold)" />
        
        {/* Cup body vertical ribs (adds 3D volume) */}
        <path d="M130 90 C140 180 170 240 200 255" stroke="#ca8a04" strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M170 90 C175 180 190 240 200 255" stroke="#ca8a04" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M230 90 C225 180 210 240 200 255" stroke="#fef08a" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M270 90 C260 180 230 240 200 255" stroke="#fef08a" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.4" />

        {/* Cup Rim */}
        <ellipse cx="200" cy="80" rx="100" ry="25" fill="url(#epicGold)" />
        <ellipse cx="200" cy="80" rx="90" ry="20" fill="#422006" /> {/* Inside dark depth */}
        <ellipse cx="200" cy="82" rx="90" ry="18" fill="url(#epicSilver)" opacity="0.3" /> {/* Inner reflection */}
        
        {/* --- CENTERPIECE / SOCCER BALL ON TOP --- */}
        <g transform="translate(200, 30)">
          {/* Soccer ball base shape */}
          <circle cx="0" cy="0" r="50" fill="url(#ballGlow)" />
          
          {/* Soccer ball pentagons (abstracted 3D look) */}
          <path d="M0 -25 L20 -10 L15 15 L-15 15 L-20 -10 Z" fill="#713f12" opacity="0.9" />
          <path d="M-40 -15 L-20 -10 L-15 15 L-35 30 Z" fill="#ca8a04" opacity="0.7" />
          <path d="M40 -15 L20 -10 L15 15 L35 30 Z" fill="#a16207" opacity="0.7" />
          <path d="M0 -45 L20 -10 L-20 -10 Z" fill="#a16207" opacity="0.8" />
          <path d="M-15 15 L0 45 L15 15 Z" fill="#eab308" opacity="0.6" />
          
          {/* Ball lines */}
          <path d="M0 -25 L0 -45 M20 -10 L40 -15 M-20 -10 L-40 -15 M15 15 L35 30 M-15 15 L-35 30 M0 45 L0 50" stroke="#422006" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* Floating Magical Stars */}
        <g className="animate-[star-twinkle_3s_ease-in-out_infinite]">
          <path d="M60 50 L65 30 L70 50 L90 55 L70 60 L65 80 L60 60 L40 55 Z" fill="#ffffff" />
        </g>
        <g className="animate-[star-twinkle_4s_ease-in-out_infinite_1s]">
          <path d="M330 90 L333 75 L336 90 L351 93 L336 96 L333 111 L330 96 L315 93 Z" fill="#fef08a" />
        </g>
        <g className="animate-[star-twinkle_2s_ease-in-out_infinite_0.5s]">
          <path d="M120 200 L122 190 L124 200 L134 202 L124 204 L122 214 L120 204 L110 202 Z" fill="#ffffff" />
        </g>

        {/* Front highlight sweep (simulates light passing over) */}
        <path d="M100 80 C100 180 140 260 200 260 C260 260 300 180 300 80 Z" fill="url(#shimmerGradient)" className="animate-[shimmer-sweep_4s_infinite] mix-blend-overlay" />
      </svg>
    </div>
  )
}
