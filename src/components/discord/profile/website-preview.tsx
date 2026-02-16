import { useEffect, useState } from 'react'
import { Github, Linkedin, ExternalLink, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types ────────────────────────────────────────────────────────────

interface PreviewData {
  title: string
  description: string
  image?: string
  siteName?: string
  username?: string
}

interface WebsitePreviewProps {
  url: string
  className?: string
}

// ── Data fetching helpers ────────────────────────────────────────────

function parseGitHubUsername(url: string) {
  return url.split('github.com/')[1]?.split('/')[0]
}

function parseLinkedInSlug(url: string) {
  return url.split('linkedin.com/in/')[1]?.split('/')[0]
}

function slugToDisplayName(slug: string) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

async function fetchGitHubPreview(username: string): Promise<PreviewData> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (res.ok) {
      const data = await res.json()
      return {
        title: `${username} - Overview`,
        description: `${username} has ${data.public_repos ?? 0} repositories available. Follow their code on GitHub.`,
        image: data.avatar_url,
        siteName: 'GitHub',
        username,
      }
    }
  } catch {
    // fall through
  }

  return {
    title: `${username} - Overview`,
    description: `${username} has repositories available. Follow their code on GitHub.`,
    image: `https://github.com/${username}.png`,
    siteName: 'GitHub',
    username,
  }
}

function buildLinkedInPreview(slug: string): PreviewData {
  const name = slugToDisplayName(slug)
  return {
    title: `${name} - Overview`,
    description: `${name} has a professional profile available. Connect with them on LinkedIn.`,
    siteName: 'LinkedIn',
    username: name,
  }
}

function buildFallbackPreview(url: string): PreviewData {
  const hostname = new URL(url).hostname.replace('www.', '')
  return { title: hostname, description: `Visit ${hostname}`, siteName: hostname }
}

// ── Custom hook ──────────────────────────────────────────────────────

function useWebsitePreview(url: string) {
  const [data, setData] = useState<PreviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function resolve() {
      try {
        const ghUser = parseGitHubUsername(url)
        if (ghUser) {
          const preview = await fetchGitHubPreview(ghUser)
          if (!cancelled) setData(preview)
          return
        }

        const liSlug = parseLinkedInSlug(url)
        if (liSlug) {
          if (!cancelled) setData(buildLinkedInPreview(liSlug))
          return
        }

        if (!cancelled) setData(buildFallbackPreview(url))
      } catch {
        if (!cancelled) setData(buildFallbackPreview(url))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    resolve()
    return () => { cancelled = true }
  }, [url])

  return { data, loading }
}

// ── Sub-components ───────────────────────────────────────────────────

function PlatformIcon({ url, className }: { url: string; className?: string }) {
  const base = cn('w-4 h-4 shrink-0 text-white/80', className)
  if (url.includes('github.com'))   return <Github className={base} />
  if (url.includes('linkedin.com')) return <Linkedin className={base} />
  return <ExternalLink className={base} />
}

function PreviewHeader({ url, label }: { url: string; label: string }) {
  return (
    <div className="px-3 py-2 flex items-center gap-2 bg-white/6 border-b border-white/8">
      <PlatformIcon url={url} />
      <span className="text-xs text-white/90 font-medium truncate">
        {label}
      </span>
    </div>
  )
}

function PreviewImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-full aspect-4/3 bg-black/20 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
      {/* Subtle glass reflection over image */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/6 via-transparent to-black/20" />
      <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/80">
        <MoreHorizontal className="w-3 h-3" />
      </span>
    </div>
  )
}

function PreviewBody({ data, url }: { data: PreviewData; url: string }) {
  const isKnown = url.includes('github.com') || url.includes('linkedin.com')

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-white/95 leading-tight">
        {data.title}
      </h3>
      <p className="mt-1 text-xs text-white/55 leading-relaxed">
        {data.description}
      </p>

      {isKnown && (
        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-white/8">
          <PlatformIcon url={url} />
          <span className="text-[10px] text-white/40">
            {data.siteName}
          </span>
        </div>
      )}
    </div>
  )
}

function PreviewSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'w-80 rounded-2xl overflow-hidden',
      'bg-white/5 backdrop-blur-2xl border border-white/12',
      className,
    )}>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/8 rounded-lg animate-pulse" />
        <div className="h-3 bg-white/6 rounded-lg w-3/4 animate-pulse" />
      </div>
    </div>
  )
}

// ── Header label builder ─────────────────────────────────────────────

function buildHeaderLabel(url: string, data: PreviewData) {
  if (url.includes('github.com'))   return `${data.siteName} ${data.username}`
  if (url.includes('linkedin.com')) return `${data.siteName} ${data.username}`
  return data.siteName ?? 'Website'
}

// ── Main component ───────────────────────────────────────────────────

export function WebsitePreview({ url, className }: WebsitePreviewProps) {
  const { data, loading } = useWebsitePreview(url)

  if (loading) return <PreviewSkeleton className={className} />
  if (!data) return null

  return (
    <div
      className={cn(
        'relative w-80 rounded-2xl overflow-hidden',
        // Liquid glass surface
        'bg-white/5 backdrop-blur-2xl backdrop-saturate-[1.8]',
        'border border-white/15',
        // Outer glow & shadow
        'shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_0.5px_0_rgba(255,255,255,0.12)]',
        className,
      )}
    >
      {/* Top specular highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />

      <PreviewHeader url={url} label={buildHeaderLabel(url, data)} />
      {data.image && <PreviewImage src={data.image} alt={data.title} />}
      <PreviewBody data={data} url={url} />

      {/* Bottom inner glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}
