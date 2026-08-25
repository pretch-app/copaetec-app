"use client"

import { useEffect, useRef } from "react"

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []

    type Particle = {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      life: number
      maxLife: number
      type: "spark" | "glow" | "star"
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    function createParticle(): Particle {
      const types: Particle["type"][] = ["spark", "glow", "star"]
      const type = types[Math.floor(Math.random() * types.length)]
      const w = canvas!.offsetWidth
      const h = canvas!.offsetHeight

      const colors = [
        "rgba(255, 215, 0, ",    // gold
        "rgba(255, 235, 150, ",  // warm light gold
        "rgba(255, 255, 255, ",  // white
        "rgba(100, 149, 237, ",  // cornflower blue accent
        "rgba(255, 200, 50, ",   // amber
        "rgba(255, 255, 220, ",  // warm white
      ]

      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: type === "star" ? Math.random() * 2 + 1 : type === "glow" ? Math.random() * 40 + 20 : Math.random() * 3 + 1,
        opacity: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.random() * 300 + 200,
        type,
      }
    }

    function init() {
      particles = []
      for (let i = 0; i < 60; i++) {
        const p = createParticle()
        p.life = Math.random() * p.maxLife
        particles.push(p)
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        // Fade in and out
        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.1) {
          p.opacity = lifeRatio / 0.1
        } else if (lifeRatio > 0.8) {
          p.opacity = (1 - lifeRatio) / 0.2
        } else {
          p.opacity = 1
        }

        p.opacity = Math.max(0, Math.min(1, p.opacity))

        if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > w + 10) {
          particles[i] = createParticle()
          continue
        }

        ctx.save()
        if (p.type === "glow") {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
          gradient.addColorStop(0, p.color + (p.opacity * 0.15) + ")")
          gradient.addColorStop(1, p.color + "0)")
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === "star") {
          ctx.fillStyle = p.color + (p.opacity * 0.8) + ")"
          ctx.shadowColor = p.color + "0.5)"
          ctx.shadowBlur = 8
          ctx.beginPath()
          // 4-point star
          const s = p.size
          ctx.moveTo(p.x, p.y - s * 2)
          ctx.lineTo(p.x + s * 0.5, p.y - s * 0.5)
          ctx.lineTo(p.x + s * 2, p.y)
          ctx.lineTo(p.x + s * 0.5, p.y + s * 0.5)
          ctx.lineTo(p.x, p.y + s * 2)
          ctx.lineTo(p.x - s * 0.5, p.y + s * 0.5)
          ctx.lineTo(p.x - s * 2, p.y)
          ctx.lineTo(p.x - s * 0.5, p.y - s * 0.5)
          ctx.closePath()
          ctx.fill()
        } else {
          ctx.fillStyle = p.color + (p.opacity * 0.7) + ")"
          ctx.shadowColor = p.color + "0.4)"
          ctx.shadowBlur = 6
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    resize()
    init()
    animate()

    window.addEventListener("resize", resize)
    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
    />
  )
}
