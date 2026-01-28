import { type LucideIcon } from 'lucide-react'

export type ProfileBadge = {
  id: string
  icon: LucideIcon
  color: string
  bgColor: string
  label: string
  value: string
  imageUrl?: string | null
  sublabel?: string
  href?: string
}

export type QuickAction = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export type Experience = {
  title: string
  subtitle: string
  date: string
  role: string
  image: string
  color: 'blue' | 'green' | 'purple' | 'orange'
  tech: string[]
  highlights: string[]
}
