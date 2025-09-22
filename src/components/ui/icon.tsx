"use client"

import React, { useEffect, useState } from 'react'

interface IconProps {
  children: React.ReactNode
  className?: string
}

export function Icon({ children, className }: IconProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Only render icons on client side to avoid hydration mismatches
  if (!isClient) {
    return (
      <span 
        className={className} 
        suppressHydrationWarning
        data-icon-wrapper="server"
      >
        {/* Placeholder for SSR */}
      </span>
    )
  }

  return (
    <span 
      className={className} 
      suppressHydrationWarning
      data-icon-wrapper="client"
    >
      {children}
    </span>
  )
}
