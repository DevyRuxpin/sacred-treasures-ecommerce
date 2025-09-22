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

  return (
    <span 
      className={className} 
      suppressHydrationWarning
      data-icon-wrapper={isClient ? 'client' : 'server'}
    >
      {children}
    </span>
  )
}
