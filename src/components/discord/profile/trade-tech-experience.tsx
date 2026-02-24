import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  Database,
  FileText,
  Loader2,
  Search,
  Sparkles,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type FileStatus = 'pending' | 'uploading' | 'embedding' | 'indexed'
type PipelinePhase = 'idle' | 'uploading' | 'embedding' | 'searching' | 'complete'

interface SimFile {
  id: string
  name: string
  pages: number
  size: string
  status: FileStatus
  progress: number
}

interface SimResult {
  id: string
  source: string
  page: number
  chunk: string
  score: number
}

const INITIAL_FILES: SimFile[] = [
  { id: 'f1', name: 'boeuf_bourguignon.pdf', pages: 8, size: '2.4 MB', status: 'pending', progress: 0 },
  { id: 'f2', name: 'weekly_order_template.pdf', pages: 4, size: '1.1 MB', status: 'pending', progress: 0 },
  { id: 'f3', name: 'tiramisu_classic.pdf', pages: 6, size: '1.8 MB', status: 'pending', progress: 0 },
]

const SEARCH_QUERY = 'Can you add Boeuf Bourguignon to this weeks order. There are 24 students'

const SEARCH_RESULTS: SimResult[] = [
  {
    id: 'r1',
    source: 'boeuf_bourguignon.pdf',
    page: 2,
    chunk: 'For 24 servings, braise 12 lbs chuck beef in 3 bottles Burgundy wine with pearl onions, carrots, and a bouquet garni for 3 hours at 325\u00b0F...',
    score: 0.96,
  },
  {
    id: 'r2',
    source: 'boeuf_bourguignon.pdf',
    page: 4,
    chunk: 'Scaling notes: multiply base recipe (serves 6) by 4. Sear beef in batches to maintain fond. Budget 2.5 lbs mushrooms, 1 lb lardons...',
    score: 0.91,
  },
  {
    id: 'r3',
    source: 'weekly_order_template.pdf',
    page: 1,
    chunk: 'Weekly procurement form — enter dish name, serving count, and lead time. Protein orders require 48-hour advance notice for 20+ servings...',
    score: 0.72,
  },
]

function FileStatusIndicator({ status, progress }: { status: FileStatus; progress: number }) {
  if (status === 'pending') {
    return <span className="text-[10px] text-white/40 font-medium">Queued</span>
  }
  if (status === 'uploading') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-sky-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-[10px] text-sky-300 font-medium tabular-nums">{progress}%</span>
      </div>
    )
  }
  if (status === 'embedding') {
    return (
      <div className="flex items-center gap-1.5">
        <Loader2 className="h-3 w-3 text-purple-300 animate-spin" />
        <span className="text-[10px] text-purple-300 font-medium">Embedding</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1.5">
      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
      <span className="text-[10px] text-emerald-300 font-medium">Indexed</span>
    </div>
  )
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 0.8
      ? 'text-emerald-300 border-emerald-400/40 bg-emerald-500/15'
      : score >= 0.6
        ? 'text-yellow-300 border-yellow-400/40 bg-yellow-500/15'
        : 'text-white/50 border-white/20 bg-white/5'
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
        color,
      )}
    >
      {score.toFixed(2)}
    </span>
  )
}

function TradesTechExperienceCard({ className }: { className?: string }) {
  const [files, setFiles] = useState<SimFile[]>(INITIAL_FILES)
  const [queryText, setQueryText] = useState('')
  const [results, setResults] = useState<SimResult[]>([])
  const [phase, setPhase] = useState<PipelinePhase>('idle')
  const [inView, setInView] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return

    const timers: number[] = []
    let elapsed = 0

    const schedule = (delay: number, fn: () => void) => {
      elapsed += delay
      timers.push(window.setTimeout(fn, elapsed))
    }

    const updateFile = (index: number, patch: Partial<SimFile>) =>
      setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))

    // --- uploading ---
    schedule(600, () => {
      setPhase('uploading')
      updateFile(0, { status: 'uploading', progress: 20 })
    })
    schedule(400, () => updateFile(0, { progress: 55 }))
    schedule(400, () => updateFile(0, { progress: 100 }))
    schedule(300, () => {
      updateFile(0, { progress: 100 })
      updateFile(1, { status: 'uploading', progress: 15 })
    })
    schedule(400, () => updateFile(1, { progress: 50 }))
    schedule(400, () => updateFile(1, { progress: 100 }))
    schedule(300, () => {
      updateFile(1, { progress: 100 })
      updateFile(2, { status: 'uploading', progress: 25 })
    })
    schedule(400, () => updateFile(2, { progress: 65 }))
    schedule(400, () => updateFile(2, { progress: 100 }))

    // --- embedding ---
    schedule(500, () => {
      setPhase('embedding')
      setFiles((prev) => prev.map((f) => ({ ...f, status: 'embedding' as const })))
    })
    schedule(800, () => updateFile(0, { status: 'indexed' }))
    schedule(600, () => updateFile(1, { status: 'indexed' }))
    schedule(600, () => updateFile(2, { status: 'indexed' }))

    // --- searching ---
    schedule(600, () => setPhase('searching'))
    for (let i = 1; i <= SEARCH_QUERY.length; i++) {
      schedule(35, () => setQueryText(SEARCH_QUERY.slice(0, i)))
    }
    schedule(600, () => setResults([SEARCH_RESULTS[0]]))
    schedule(500, () => setResults((prev) => [...prev, SEARCH_RESULTS[1]]))
    schedule(400, () => {
      setResults((prev) => [...prev, SEARCH_RESULTS[2]])
      setPhase('complete')
    })

    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [inView])

  useEffect(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const tid = setTimeout(() => {
      el.scrollTop = el.scrollHeight
    }, 50)
    return () => clearTimeout(tid)
  }, [results, queryText, files])

  const totalChunks = files.reduce((sum, f) => (f.status === 'indexed' ? sum + f.pages : sum), 0)

  return (
    <div
      ref={sentinelRef}
      className={cn(
        'relative w-full max-w-[460px] h-[560px] rounded-2xl overflow-hidden',
        'backdrop-blur-xl bg-black/15 border border-white/15',
        'shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
        className,
      )}
    >
      <div className="relative flex flex-col w-full h-full overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/10 bg-black/60 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">AI Recipe Playground</h2>
              <p className="text-xs text-white/75">OpenAI Embeddings + Vector Store</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/20 px-3 py-1 text-xs text-sky-200 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-sky-300" />
              Live simulation
            </div>
          </div>
        </div>

        {/* Config badges */}
        <div className="px-4 py-2 border-b border-white/10 bg-black/40 flex flex-wrap gap-2 relative z-10">
          {[
            { label: 'Model', value: 'gpt-4o' },
            { label: 'Embedding', value: 'text-embedding-3-small' },
            { label: 'Vector DB', value: 'Pinecone' },
            { label: 'Chunks', value: String(totalChunks) },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/30 px-2 py-1"
            >
              <span className="text-[9px] uppercase tracking-wider text-white/40">
                {badge.label}
              </span>
              <span className="text-[10px] font-medium text-white/80">{badge.value}</span>
            </div>
          ))}
        </div>

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 px-4 py-3 overflow-y-auto space-y-3 relative z-10"
        >
          {/* Upload queue */}
          <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/20">
              <Upload className="h-3.5 w-3.5 text-sky-300" />
              <span className="text-[11px] font-medium text-white/70 uppercase tracking-wide">
                Document Upload Queue
              </span>
            </div>
            <div className="p-2 space-y-1.5">
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-2"
                >
                  <FileText
                    className={cn(
                      'h-4 w-4 shrink-0',
                      file.status === 'indexed'
                        ? 'text-emerald-400'
                        : file.status === 'embedding'
                          ? 'text-purple-300'
                          : file.status === 'uploading'
                            ? 'text-sky-300'
                            : 'text-white/30',
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white/90 truncate">{file.name}</p>
                    <p className="text-[10px] text-white/40">
                      {file.pages} pages &middot; {file.size}
                    </p>
                  </div>
                  <FileStatusIndicator status={file.status} progress={file.progress} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Vector search */}
          {(phase === 'embedding' || phase === 'searching' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-white/10 bg-black/30 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/20">
                <Search className="h-3.5 w-3.5 text-emerald-300" />
                <span className="text-[11px] font-medium text-white/70 uppercase tracking-wide">
                  Vector Search
                </span>
              </div>

              <div className="p-2.5 space-y-2.5">
                {queryText && (
                  <div className="rounded-lg border border-sky-400/30 bg-sky-500/8 px-3 py-2">
                    <p className="text-[10px] text-white/40 mb-1">Query</p>
                    <p className="text-xs text-white/90 font-medium">
                      {queryText}
                      {phase === 'searching' && queryText.length < SEARCH_QUERY.length && (
                        <span className="inline-block w-[2px] h-3 bg-sky-300 ml-0.5 animate-pulse" />
                      )}
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-white/40 px-1">
                      Retrieved {results.length} chunk{results.length !== 1 ? 's' : ''} &middot;
                      cosine similarity
                    </p>
                    <AnimatePresence>
                      {results.map((result) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.35 }}
                          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Database className="h-3 w-3 text-white/30 shrink-0" />
                              <span className="text-[10px] text-white/60 truncate">
                                {result.source} &middot; p.{result.page}
                              </span>
                            </div>
                            <ScoreBadge score={result.score} />
                          </div>
                          <p className="text-[11px] text-white/70 leading-relaxed line-clamp-2">
                            &ldquo;{result.chunk}&rdquo;
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/60 relative z-10">
          <div className="flex items-center justify-between text-xs text-white/90">
            <span className="font-medium">Pipeline status</span>
            <span
              className={cn(
                'rounded-full border px-2 py-1 font-medium',
                phase === 'complete'
                  ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
                  : 'border-sky-400/50 bg-sky-500/20 text-sky-200',
              )}
            >
              {phase === 'idle' && 'Initializing'}
              {phase === 'uploading' && 'Uploading'}
              {phase === 'embedding' && 'Embedding'}
              {phase === 'searching' && 'Searching'}
              {phase === 'complete' && 'Completed'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TradesTechExperienceShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row gap-6 rounded-2xl border border-discord-divider bg-discord-dark p-4 lg:p-6',
        className,
      )}
    >
      <div className="lg:w-1/3 flex min-h-0 flex-col gap-6 text-sm lg:min-h-[520px]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-emerald-400/90 shrink-0" />
            <h3 className="text-2xl font-semibold text-discord-text-primary">
              AI Document Pipeline
            </h3>
          </div>
          <p className="text-sm text-discord-text-secondary leading-relaxed">
            Engineered an intelligent document processing pipeline using OpenAI&apos;s Assistant
            API and vector stores to automate intake and semantic search over recipe PDF
            documents.
          </p>
        </div>

        <Button
          variant="outline"
          className="w-fit rounded-full border-white/20 bg-white/5 text-discord-text-primary hover:bg-white/10 hover:text-white"
        >
          Explore Document Pipeline
        </Button>

        <div className="mt-auto flex flex-col">
          <span className="text-sm font-medium text-discord-text-primary">
            Upload recipe PDFs
          </span>
          <div className="mt-3 border-t border-discord-divider" />

          <span className="mt-4 text-sm font-medium text-discord-text-primary">
            Embed &amp; index into vector store
          </span>
          <div className="mt-3 border-t border-discord-divider" />

          <div className="mt-4">
            <span className="text-sm font-medium text-discord-text-primary">
              Semantic search &amp; retrieval
            </span>
            <p className="mt-1.5 text-xs text-discord-text-secondary leading-relaxed">
              Query the vector database with natural language and retrieve the most relevant
              recipe chunks with confidence scores.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex justify-center min-h-[520px] rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1200&q=80)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 rounded-xl bg-linear-to-t from-transparent via-discord-dark/40 to-discord-dark/90"
          aria-hidden
        />
        <div className="relative z-10 flex items-center justify-center py-6">
          <TradesTechExperienceCard />
        </div>
      </div>
    </div>
  )
}
