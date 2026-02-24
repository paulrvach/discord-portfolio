import type { ReactNode } from 'react'

interface CustomMessageProps {
  children: ReactNode
}

export function CustomMessage({ children }: CustomMessageProps) {
  return <div className="mt-1">{children}</div>
}
