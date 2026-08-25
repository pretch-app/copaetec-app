"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function PageHeader({ 
  title, 
  subtitle,
  breadcrumbs
}: { 
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
}) {
  return (
    <div className="relative border-b border-border bg-sidebar text-sidebar-foreground overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} 
      />
      
      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
      
      <div className="relative mx-auto max-w-6xl px-4 py-10">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-sidebar-foreground/60 animate-fade-up">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-sidebar-foreground font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </nav>
        )}
        
        <div className="animate-fade-up delay-100">
          {title && <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">{title}</h1>}
          {subtitle && <div className="mt-3 max-w-2xl text-sidebar-foreground/75 text-pretty text-lg">{subtitle}</div>}
        </div>
      </div>
    </div>
  )
}
