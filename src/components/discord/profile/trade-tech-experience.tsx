import { Bot, Cloud, FileText, Server, Cpu, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const highlights = [
  {
    icon: FileText,
    title: 'Intelligent Document Processing',
    description:
      "Engineered intelligent document processing pipeline using OpenAI's Assistant API and vector stores to automate intake of student enrollment documents.",
    tags: ['OpenAI Assistant API', 'Vector Stores', 'RAG'],
  },
  {
    icon: Cloud,
    title: 'Serverless Query Agent',
    description:
      'Architected a serverless query agent on AWS Lambda that enables natural-language search over processed documents with sub-second response times.',
    tags: ['AWS Lambda', 'Serverless', 'NLP'],
  },
]

export function TradesTechExperienceShowcase({
  className,
}: {
  className?: string
}) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-lg bg-discord-darker/60 border border-discord-divider overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-discord-divider">
          <Bot className="size-4 text-discord-blurple" />
          <span className="text-xs font-semibold uppercase tracking-wider text-discord-text-muted">
            Project Highlights
          </span>
        </div>

        <div className="p-4 space-y-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="group flex gap-3 rounded-md bg-discord-dark/80 p-3 border border-discord-divider/50 transition-colors hover:border-discord-blurple/40"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-discord-blurple/15 text-discord-blurple">
                <item.icon className="size-4" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <p className="text-sm font-medium text-discord-text-primary">
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed text-discord-text-secondary">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-discord-blurple/10 px-2 py-0.5 text-[10px] font-medium text-discord-blurple"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Server, label: 'AWS Lambda', sublabel: 'Compute' },
          { icon: Cpu, label: 'OpenAI', sublabel: 'AI/ML' },
          { icon: Zap, label: 'Vector DB', sublabel: 'Search' },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1.5 rounded-lg bg-discord-darker/60 border border-discord-divider p-3 text-center"
          >
            <item.icon className="size-5 text-discord-text-muted" />
            <span className="text-xs font-medium text-discord-text-primary">
              {item.label}
            </span>
            <span className="text-[10px] text-discord-text-muted">
              {item.sublabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
