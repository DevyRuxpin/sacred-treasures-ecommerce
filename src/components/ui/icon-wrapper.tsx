import { ReactNode } from "react"

interface IconWrapperProps {
  children: ReactNode
  className?: string
}

export function IconWrapper({ children, className }: IconWrapperProps) {
  return (
    <span className={className} suppressHydrationWarning>
      {children}
    </span>
  )
}
