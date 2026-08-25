"use client"

import { useEffect, useState, useRef } from "react"

export function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  
  // Create a simple intersection observer using native API since framer-motion might not be installed
  // Wait, I see useInView from framer-motion imported, let's see if framer-motion is in package.json.
  // Actually, I can just implement a simple native one to be safe.
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0
          const end = value
          if (start === end) {
            setCount(end)
            return
          }
          const totalMilSecDur = duration
          const incrementTime = (totalMilSecDur / end) * 2 // simple approximation
          const timer = setInterval(() => {
            start += 1
            setCount(String(start) === String(end) ? end : start)
            if (start === end) clearInterval(timer)
          }, incrementTime > 10 ? incrementTime : 10)
          
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{count}</span>
}
