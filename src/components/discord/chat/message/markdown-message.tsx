import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import type { MarkdownPayload } from './message-types'
import type { Components } from 'react-markdown'

interface MarkdownMessageProps {
  markdown: MarkdownPayload
}

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="pb-2 mb-4 text-2xl font-semibold border-b border-discord-divider text-discord-text-primary">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="pb-2 mb-3 mt-6 text-xl font-semibold border-b border-discord-divider text-discord-text-primary">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-lg font-semibold text-discord-text-primary">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mb-2 mt-4 text-base font-semibold text-discord-text-primary">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-3 leading-relaxed text-discord-text-primary">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-blue-400 hover:underline"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 pl-6 space-y-1 list-disc text-discord-text-primary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 pl-6 space-y-1 list-decimal text-discord-text-primary">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 pl-4 border-l-4 border-discord-text-muted text-discord-text-secondary italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return (
        <code className={`${className ?? ''} text-sm`}>
          {children}
        </code>
      )
    }
    return (
      <code className="bg-discord-dark/80 px-1.5 py-0.5 rounded text-sm text-discord-text-primary">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="mb-3 p-4 rounded-md bg-[#0d1117] overflow-x-auto text-sm leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-discord-text-primary">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-discord-dark/60">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold border border-discord-divider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border border-discord-divider">{children}</td>
  ),
  hr: () => <hr className="my-4 border-discord-divider" />,
  img: ({ src, alt }) => (
    <img
      src={src}
      alt={alt ?? ''}
      className="max-w-full rounded-md my-2"
      loading="lazy"
    />
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-discord-text-primary">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through">{children}</del>,
  input: ({ checked, disabled }) => (
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      readOnly
      className="mr-2 accent-discord-blurple"
    />
  ),
}

export function MarkdownMessage({ markdown }: MarkdownMessageProps) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!markdown.url) {
      setError('No URL available for this markdown file.')
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchMarkdown() {
      try {
        const response = await fetch(markdown.url!)
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status}`)
        }
        const text = await response.text()
        if (!cancelled) {
          setContent(text)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load markdown')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMarkdown()
    return () => {
      cancelled = true
    }
  }, [markdown.url])

  if (loading) {
    return (
      <div className="mt-2 max-w-2xl rounded-md bg-discord-dark/60 border border-discord-divider p-4">
        <div className="flex items-center gap-2 text-sm text-discord-text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-discord-text-muted border-t-transparent" />
          Loading markdown...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-2 max-w-2xl rounded-md bg-discord-dark/60 border border-red-500/30 p-4">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="mt-2 max-w-2xl rounded-md bg-discord-dark/60 border border-discord-divider p-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
