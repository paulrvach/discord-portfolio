import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
      outputData: {
        query: string
        topSignals: string[]
        sourcesTarget: number
      }
      logs: Array<{
        id: string
        label: string
        target: number
      }>
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
      outputData: {
        query: 'LangChain Deep Agents 2026 trends',
        topSignals: ['tool orchestration UX patterns', 'structured agent traces', 'streaming tool results'],
        sourcesTarget: 12,
      },
      logs: [
        { id: 'sources', label: '[tool] google_search: sources located', target: 12 },
        { id: 'sections', label: '[tool] crawl_docs: sections parsed', target: 18 },
        { id: 'themes', label: '[tool] summarize: key themes extracted', target: 4 },
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

const buildOutput = (item: Extract<TimelineItem, { type: 'task' }>, progress: Record<string, number>) => {
  const sourcesCount = Math.min(progress.sources ?? 0, item.outputData.sourcesTarget)
  return `{
  "query": "${item.outputData.query}",
  "topSignals": [
    "${item.outputData.topSignals[0]}",
    "${item.outputData.topSignals[1]}",
    "${item.outputData.topSignals[2]}"
  ],
  "sources": ${sourcesCount}
}`
}

export function DeepAgentExperienceCard({ className }: { className?: string }) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [expandedSteps, setExpandedSteps] = useState({
    task: true,
    thinking: true,
    tool: true,
  })
  const [progress, setProgress] = useState<Record<string, number>>({})
  const timersRef = useRef<number[]>([])
  const progressTimerRef = useRef<number | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)

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
              outputData: event.payload.outputData,
              logs: event.payload.logs,
            },
          ])
          setProgress(
            event.payload.logs.reduce<Record<string, number>>((acc, log) => {
              acc[log.id] = 0
              return acc
            }, {})
          )
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

  useEffect(() => {
    if (!chatContainerRef.current) return
    
    const container = chatContainerRef.current
    
    const scrollToBottom = () => {
      // Scroll only the container, not the window
      container.scrollTop = container.scrollHeight
    }
    
    // Wait for DOM updates and animations to complete
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToBottom)
      })
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [timeline])

  useEffect(() => {
    const activeTask = timeline.find((item) => item.type === 'task') as
      | Extract<TimelineItem, { type: 'task' }>
      | undefined

    if (!activeTask) return

    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }

    if (activeTask.status === 'running') {
      progressTimerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          const updated = { ...prev }
          activeTask.logs.forEach((log) => {
            const current = updated[log.id] ?? 0
            if (current < log.target) {
              const step = log.target > 10 ? 2 : 1
              updated[log.id] = Math.min(log.target, current + step)
            }
          })
          return updated
        })
      }, 300)
    } else {
      setProgress((prev) => {
        const updated = { ...prev }
        activeTask.logs.forEach((log) => {
          updated[log.id] = log.target
        })
        return updated
      })
    }

    return () => {
      if (progressTimerRef.current) {
        window.clearInterval(progressTimerRef.current)
        progressTimerRef.current = null
      }
    }
  }, [timeline])

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

        <div ref={chatContainerRef} className="flex-1 min-h-0 px-4 py-3 overflow-y-auto space-y-3 text-sm flex flex-col relative z-10">
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
                          {buildOutput(item, progress)}
                        </pre>
                      )}
                    </div>

                    <div className="space-y-2">
                      {item.logs.map((log, logIndex) => {
                        const currentValue = Math.min(progress[log.id] ?? 0, log.target)
                        const isComplete = item.status === 'complete' || currentValue >= log.target
                        return (
                        <div
                          key={log.id}
                          className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[11px] text-white/70"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isComplete ? (
                              <motion.span
                                key={`${log.id}-check`}
                                initial={{ scale: 0.6, rotate: -60, opacity: 0 }}
                                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                exit={{ scale: 0.6, opacity: 0 }}
                                transition={{ duration: 0.25, delay: logIndex * 0.05 }}
                                className="inline-flex"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              </motion.span>
                            ) : (
                              <motion.span
                                key={`${log.id}-spinner`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex"
                              >
                                <Loader2 className="h-3.5 w-3.5 text-sky-300 animate-spin" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                          <span>{log.label}</span>
                          <motion.span
                            key={`${log.id}-${currentValue}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-auto text-white/80"
                          >
                            {currentValue}/{log.target}
                          </motion.span>
                        </div>
                        )
                      })}
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

export function DeepAgentExperienceShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row gap-6 rounded-2xl border border-discord-divider bg-discord-dark p-4 lg:p-6',
        className
      )}
    >
      <div className="lg:w-[45%] space-y-4 text-sm text-discord-text-secondary">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-discord-text-muted">
            Deep Agent Experience
          </p>
          <h3 className="text-2xl font-semibold text-discord-text-primary">
            Google + LangChain Deep Agents
          </h3>
        </div>
        <p className="leading-relaxed">
          I led multi-agent workflow design with LangChain Deep Agents, focusing on
          traceable tool usage, structured task visibility, and reviewer-ready outputs.
        </p>
        <div className="space-y-2">
          {[
            'Designed collapsible reasoning steps with status telemetry.',
            'Built tool usage logs with progress metrics and audit trails.',
            'Optimized human-in-the-loop UX for technical stakeholders.',
          ].map((detail) => (
            <div
              key={detail}
              className="flex items-start gap-2 rounded-lg border border-discord-divider bg-discord-darker px-3 py-2 text-xs text-discord-text-secondary"
            >
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-discord-green" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-discord-blurple/40 bg-discord-blurple/15 px-3 py-1 text-xs text-discord-text-primary">
          <Sparkles className="h-3.5 w-3.5 text-discord-blurple" />
          Deep Agents UI • Technical credibility
        </div>
      </div>
      <div className="flex-1 flex justify-center lg:justify-end">
        <DeepAgentExperienceCard />
      </div>
    </div>
  )
}
