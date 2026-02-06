"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  CheckCircle2,
  FileIcon,
  GitCommit,
  Loader2,
  Minus,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TaskStatus = "running" | "complete"
type FileStatus = "added" | "modified" | "deleted" | "renamed"

type TaskItem = {
  id: string
  title: string
  detail: string
}

type CommitFile = {
  path: string
  status: FileStatus
  additions: number
  deletions: number
}

type TimelineItem =
  | {
      id: string
      type: "message"
      text: string
    }
  | {
      id: string
      type: "task"
      status: TaskStatus
      title: string
      detail: string
    }
  | {
      id: string
      type: "commit"
      hash: string
      message: string
      author: string
      files: CommitFile[]
    }

const tasks: TaskItem[] = [
  {
    id: "nav",
    title: "Reusable navigation shell",
    detail: "Sidebars, command palette, app chrome",
  },
  {
    id: "cards",
    title: "Media cards + grids",
    detail: "Album tiles, hero cards, hover motion",
  },
  {
    id: "states",
    title: "System states",
    detail: "Loading, empty, and error patterns",
  },
  {
    id: "docs",
    title: "Documentation & handoff",
    detail: "Storybook-ready usage notes",
  },
]

const commitFiles: CommitFile[] = [
  {
    path: "src/components/navigation/shell.tsx",
    status: "added",
    additions: 124,
    deletions: 0,
  },
  {
    path: "src/components/media/card-grid.tsx",
    status: "added",
    additions: 89,
    deletions: 0,
  },
  {
    path: "src/lib/system-states.ts",
    status: "modified",
    additions: 45,
    deletions: 12,
  },
  {
    path: "docs/handoff.mdx",
    status: "added",
    additions: 67,
    deletions: 0,
  },
]

const statusColors: Record<FileStatus, string> = {
  added: "text-emerald-400",
  modified: "text-amber-300",
  deleted: "text-rose-400",
  renamed: "text-sky-300",
}

const statusLabels: Record<FileStatus, string> = {
  added: "A",
  modified: "M",
  deleted: "D",
  renamed: "R",
}

type ScenarioEvent =
  | {
      delay: number
      type: "message"
      payload: { id: string; text: string }
    }
  | {
      delay: number
      type: "task"
      payload: TaskItem
    }
  | {
      delay: number
      type: "task_update"
      payload: { id: string }
    }
  | {
      delay: number
      type: "commit"
      payload: {
        id: string
        hash: string
        message: string
        author: string
        files: CommitFile[]
      }
    }

export function AgentCommitShowcase({ className }: { className?: string }) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([])
  const [isInView, setIsInView] = useState(false)
  const timersRef = useRef<number[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  const scenario = useMemo<ScenarioEvent[]>(() => {
    const events: ScenarioEvent[] = [
      {
        delay: 700,
        type: "message",
        payload: {
          id: "agent-message",
          text: "Planning Stage Dive UI component delivery...",
        },
      },
    ]

    tasks.forEach((task) => {
      events.push({
        delay: 700,
        type: "task",
        payload: task,
      })
      events.push({
        delay: 900,
        type: "task_update",
        payload: { id: task.id },
      })
    })

    events.push({
      delay: 900,
      type: "commit",
      payload: {
        id: "commit",
        hash: "f4a8c2e",
        message: "feat(ui): ship Stage Dive component library",
        author: "StageDive Agent",
        files: commitFiles,
      },
    })

    return events
  }, [])

  // Intersection Observer to detect when component is in view
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
      }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isInView])

  // Start animation only when component is in view
  useEffect(() => {
    if (!isInView) return

    let elapsed = 0
    scenario.forEach((event) => {
      elapsed += event.delay
      const timerId = window.setTimeout(() => {
        if (event.type === "message") {
          setTimeline((prev) => [
            ...prev,
            { id: event.payload.id, type: "message", text: event.payload.text },
          ])
          return
        }

        if (event.type === "task") {
          setTimeline((prev) => [
            ...prev,
            {
              id: event.payload.id,
              type: "task",
              status: "running",
              title: event.payload.title,
              detail: event.payload.detail,
            },
          ])
          return
        }

        if (event.type === "task_update") {
          setTimeline((prev) =>
            prev.map((item) =>
              item.type === "task" && item.id === event.payload.id
                ? { ...item, status: "complete" }
                : item
            )
          )
          return
        }

        if (event.type === "commit") {
          setTimeline((prev) => [
            ...prev,
            {
              id: event.payload.id,
              type: "commit",
              hash: event.payload.hash,
              message: event.payload.message,
              author: event.payload.author,
              files: event.payload.files,
            },
          ])
        }
      }, elapsed)

      timersRef.current.push(timerId)
    })

    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      timersRef.current = []
    }
  }, [scenario, isInView])

  return (
    <div ref={containerRef} className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-discord-text-primary">
          Quick picks
        </h4>
        <span className="text-xs text-discord-text-muted">
          Highlights delivered
        </span>
      </div>

      <Card className="rounded-xl border-discord-divider bg-discord-darker">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-discord-text-primary">
                Agent planning + commit trace
              </CardTitle>
              <p className="text-xs text-discord-text-muted">
                Stage Dive UI delivery pipeline
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-discord-divider bg-discord-dark text-discord-text-primary"
            >
              <GitCommit className="mr-1 h-3.5 w-3.5 text-discord-blurple" />
              committing
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {timeline.map((item, index) => {
                if (item.type === "message") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="rounded-lg border border-discord-divider bg-discord-dark px-3 py-2 text-xs text-discord-text-secondary"
                    >
                      {item.text}
                    </motion.div>
                  )
                }

                if (item.type === "task") {
                  const StatusIcon =
                    item.status === "complete" ? CheckCircle2 : Loader2
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="flex items-start gap-3 rounded-lg border border-discord-divider bg-discord-dark px-3 py-2"
                    >
                      <StatusIcon
                        className={cn(
                          "mt-0.5 h-4 w-4",
                          item.status === "complete"
                            ? "text-discord-green"
                            : "text-discord-text-muted animate-spin"
                        )}
                      />
                      <div>
                        <div className="text-sm font-semibold text-discord-text-primary">
                          {item.title}
                        </div>
                        <div className="text-xs text-discord-text-muted">
                          {item.detail}
                        </div>
                      </div>
                    </motion.div>
                  )
                }

                if (item.type === "commit") {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.4 }}
                      className="rounded-lg border border-discord-divider bg-discord-dark p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-discord-text-muted">
                            <GitCommit className="h-3.5 w-3.5 text-discord-text-primary" />
                            <span className="font-mono">{item.hash}</span>
                          </div>
                          <div className="text-sm font-semibold text-discord-text-primary">
                            {item.message}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-discord-text-muted">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px]">
                                SA
                              </AvatarFallback>
                            </Avatar>
                            {item.author}
                            <span>•</span>
                            just now
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-discord-divider bg-discord-darker text-discord-text-primary"
                        >
                          {item.files.length} files
                        </Badge>
                      </div>

                      <div className="mt-3 space-y-2">
                        {item.files.map((file) => (
                          <div
                            key={file.path}
                            className="flex items-center justify-between gap-3 rounded-md border border-discord-divider bg-discord-darker px-2 py-1 text-xs"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span
                                className={cn(
                                  "font-mono text-[11px]",
                                  statusColors[file.status]
                                )}
                              >
                                {statusLabels[file.status]}
                              </span>
                              <FileIcon className="h-3.5 w-3.5 text-discord-text-muted" />
                              <span className="truncate font-mono text-[11px] text-discord-text-secondary">
                                {file.path}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-[11px]">
                              {file.additions > 0 && (
                                <span className="text-discord-green">
                                  <Plus className="inline-block h-3 w-3" />
                                  {file.additions}
                                </span>
                              )}
                              {file.deletions > 0 && (
                                <span className="text-discord-red">
                                  <Minus className="inline-block h-3 w-3" />
                                  {file.deletions}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )
                }

                return null
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
