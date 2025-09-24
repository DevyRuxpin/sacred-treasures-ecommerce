"use client"

import React from "react"
import { LucideIcon } from "lucide-react"

interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon
  className?: string
}

export function Icon({ icon: LucideIconComponent, className, ...props }: IconProps) {
  return (
    <LucideIconComponent 
      className={className} 
      suppressHydrationWarning 
      {...props} 
    />
  )
}