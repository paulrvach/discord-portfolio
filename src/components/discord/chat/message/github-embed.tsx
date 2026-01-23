import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import type { GitHubEmbed as GitHubEmbedType } from './message-types'

interface GitHubEmbedProps {
  embed: GitHubEmbedType
  timeLabel: string
}

export function GitHubEmbed({ embed, timeLabel }: GitHubEmbedProps) {
  return (
    <div
      className="mt-1 rounded-md bg-discord-dark/60 border-l-4 p-3 space-y-2"
      style={{ borderLeftColor: embed.color ?? '#5865F2' }}
    >
      <div className="flex items-center gap-2 text-xs text-discord-text-secondary">
        {embed.authorAvatarUrl && (
          <img
            src={embed.authorAvatarUrl}
            alt={embed.authorName}
            className="w-4 h-4 rounded-full"
          />
        )}
        <span className="text-discord-text-primary font-medium">
          {embed.authorName}
        </span>
        <span className="text-discord-text-secondary">
          pushed to {embed.branchName}
        </span>
      </div>

      <a
        href={embed.titleUrl}
        className="text-sm font-semibold text-discord-text-primary hover:underline"
        target="_blank"
        rel="noreferrer"
      >
        {embed.title}
      </a>

      {embed.description && (
        <div className="text-sm text-discord-text-primary leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
            {embed.description}
          </ReactMarkdown>
        </div>
      )}

      {embed.commitHash && embed.commitUrl && (
        <a
          href={embed.commitUrl}
          className="text-xs text-discord-text-muted hover:text-discord-text-primary"
          target="_blank"
          rel="noreferrer"
        >
          {embed.commitHash}
        </a>
      )}

      <div className="flex items-center gap-2 text-[11px] text-discord-text-muted">
        {embed.footerIconUrl && (
          <img
            src={embed.footerIconUrl}
            alt={embed.footerText ?? 'GitHub'}
            className="w-3 h-3"
          />
        )}
        <span>{embed.footerText ?? 'GitHub'}</span>
        <span>•</span>
        <span>{timeLabel}</span>
      </div>
    </div>
  )
}
