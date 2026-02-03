import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ChevronDown,
  Loader2,
  Search,
  Sparkles,
  TerminalSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type TaskStatus = 'running' | 'complete'

type TimelineItem =
  | {
    id: string
    type: 'message'
    sender: 'agent' | 'user'
    text: string
  }
  | {
    id: string
    type: 'task'
    status: TaskStatus
    title: string
    toolLabel: string
    summary: string
    output: string
    logs: string[]
  }

const scenario = [
  {
    delay: 900,
    type: 'message' as const,
    payload: {
      id: 'user-message',
      sender: 'user' as const,
      text: 'Analyze the latest trends in LangChain Deep Agents.',
    },
  },
  {
    delay: 1400,
    type: 'task' as const,
    payload: {
      id: 'agent-task',
      status: 'running' as const,
      title: 'Searching Google',
      toolLabel: 'Tool: Google Search',
      summary: 'Collecting signals from recent releases, docs, and demos.',
      output: `{
  "query": "LangChain Deep Agents 2026 trends",
  "topSignals": [
    "tool orchestration UX patterns",
    "structured agent traces",
    "streaming tool results"
  ],
  "sources": 12
}`,
      logs: [
        '[tool] google_search: 12 sources located',
        '[tool] crawl_docs: parsed 18 sections',
        '[tool] summarize: 4 key themes extracted',
      ],
    },
  },
  {
    delay: 1600,
    type: 'task_update' as const,
    payload: {
      id: 'agent-task',
      status: 'complete' as const,
      title: 'Search complete',
      summary: 'Signals merged into a coherent multi-agent narrative.',
    },
  },
  {
    delay: 1400,
    type: 'message' as const,
    payload: {
      id: 'agent-message',
      sender: 'agent' as const,
      text: "Based on the analysis, I've optimized the workflow with collapsible traces, verified tool usage, and a clean status timeline for reviewers.",
    },
  },
]

export function DeepAgentExperienceCard({ className }: { className?: string }) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [expandedSteps, setExpandedSteps] = useState({
    task: true,
    thinking: true,
    tool: true,
  })
  const timersRef = useRef<number[]>([])

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }).map(() => ({
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        left: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    []
  )

  useEffect(() => {
    let isActive = true
    let elapsed = 0

    scenario.forEach((event) => {
      elapsed += event.delay
      const timerId = window.setTimeout(() => {
        if (!isActive) return

        if (event.type === 'message') {
          setTimeline((prev) => [
            ...prev,
            {
              id: event.payload.id,
              type: 'message',
              sender: event.payload.sender,
              text: event.payload.text,
            },
          ])
          return
        }

        if (event.type === 'task') {
          setTimeline((prev) => [
            ...prev,
            {
              id: event.payload.id,
              type: 'task',
              status: event.payload.status,
              title: event.payload.title,
              toolLabel: event.payload.toolLabel,
              summary: event.payload.summary,
              output: event.payload.output,
              logs: event.payload.logs,
            },
          ])
          setExpandedSteps({ task: true, thinking: true, tool: true })
          return
        }

        if (event.type === 'task_update') {
          setTimeline((prev) =>
            prev.map((item) =>
              item.type === 'task' && item.id === event.payload.id
                ? {
                  ...item,
                  status: event.payload.status,
                  title: event.payload.title,
                  summary: event.payload.summary,
                }
                : item
            )
          )
        }
      }, elapsed)

      timersRef.current.push(timerId)
    })

    return () => {
      isActive = false
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    }
  }, [])

  return (
    <div className={cn('relative w-full max-w-[460px] h-[560px] rounded-2xl overflow-hidden p-[2px]', className)}>
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-white/20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative flex flex-col w-full h-full rounded-xl border border-white/10 overflow-hidden bg-black/90 backdrop-blur-xl">
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-gray-800 via-black to-gray-900"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% 200%' }}
        />

        {particles.map((particle, index) => (
          <motion.div
            key={`particle-${index}`}
            className="absolute w-1 h-1 rounded-full bg-white/10"
            animate={{
              y: ['0%', '-140%'],
              x: [particle.x, particle.y],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut',
            }}
            style={{ left: particle.left, bottom: '-10%' }}
          />
        ))}

        <div className="px-4 py-3 border-b border-white/10 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Deep Agent Experience</h2>
              <p className="text-xs text-white/60">Google + LangChain Deep Agents</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <Sparkles className="h-3.5 w-3.5" />
              Live simulation
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 text-sm flex flex-col relative z-10">
          {timeline.map((item, index) => {
            if (item.type === 'message') {
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.25 }}
                  className={cn(
                    'px-3 py-2 rounded-xl max-w-[85%] shadow-md backdrop-blur-md',
                    item.sender === 'agent'
                      ? 'bg-white/10 text-white self-start'
                      : 'bg-white/30 text-black font-semibold self-end'
                  )}
                >
                  {item.text}
                </motion.div>
              )
            }

            const statusIcon =
              item.status === 'complete' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <Loader2 className="h-4 w-4 text-sky-300 animate-spin" />
              )

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.25 }}
                className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedSteps((prev) => ({ ...prev, task: !prev.task }))
                  }
                  className="w-full flex items-center justify-between px-3 py-2 text-left"
                >
                  <div className="flex items-center gap-2 text-white">
                    {statusIcon}
                    <span className="font-semibold">{item.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-white/70 transition-transform',
                      expandedSteps.task ? 'rotate-180' : 'rotate-0'
                    )}
                  />
                </button>

                {expandedSteps.task && (
                  <div className="border-t border-white/10 px-3 pb-3 pt-2 space-y-3 text-xs text-white/70">
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                      <TerminalSquare className="h-4 w-4 text-sky-200" />
                      <div>
                        <div className="text-[11px] uppercase tracking-wide text-white/50">
                          Tool Usage Log
                        </div>
                        <div className="text-white/80">{item.toolLabel}</div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            thinking: !prev.thinking,
                          }))
                        }
                        className="flex w-full items-center justify-between text-left text-white/80"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-300" />
                          Thinking summary
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 transition-transform',
                            expandedSteps.thinking ? 'rotate-180' : 'rotate-0'
                          )}
                        />
                      </button>
                      {expandedSteps.thinking && (
                        <div className="text-white/70">
                          {item.summary}
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSteps((prev) => ({ ...prev, tool: !prev.tool }))
                        }
                        className="flex w-full items-center justify-between text-left text-white/80"
                      >
                        <span className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-emerald-300" />
                          Tool output
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-3.5 w-3.5 transition-transform',
                            expandedSteps.tool ? 'rotate-180' : 'rotate-0'
                          )}
                        />
                      </button>
                      {expandedSteps.tool && (
                        <pre className="whitespace-pre-wrap rounded-md bg-black/60 p-2 text-[11px] text-emerald-100">
                          {item.output}
                        </pre>
                      )}
                    </div>

                    <div className="space-y-2">
                      {item.logs.map((log) => (
                        <div
                          key={log}
                          className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-white/70"
                        >
                          {item.status === 'complete' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Loader2 className="h-3.5 w-3.5 text-sky-300 animate-spin" />
                          )}
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="px-4 py-3 border-t border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Agent status</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-white/70">
              {timeline.some((item) => item.type === 'task' && item.status === 'complete')
                ? 'Completed'
                : 'Running'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
