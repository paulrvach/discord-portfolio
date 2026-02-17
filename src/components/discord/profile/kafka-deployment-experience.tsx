import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Cloud, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import {
  WebPreview,
  WebPreviewBody,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
} from '@/components/ai/web-preview'

type DeployStep = {
  id: string
  title: string
  subtitle: string
  detail: string
}

const deploymentSteps: DeployStep[] = [
  {
    id: 'request',
    title: 'Create Cluster Request',
    subtitle: 'App Router endpoint receives deployment payload',
    detail: 'Validates cluster shape and replication config before orchestration starts.',
  },
  {
    id: 'awssdk',
    title: 'AWS-SDK Control Plane',
    subtitle: 'MSK createCluster + VPC wiring',
    detail: 'Brokers, networking, and IAM policies are provisioned as a single flow.',
  },
  {
    id: 'health',
    title: 'Broker Health Sync',
    subtitle: 'Prometheus exporters register targets',
    detail: 'Heartbeat stream marks broker readiness and confirms bootstrap endpoint.',
  },
  {
    id: 'handoff',
    title: 'Traffic Handoff',
    subtitle: 'Dashboard reports live state to operators',
    detail: 'Grafana panel flips to green and message throughput starts streaming.',
  },
]

const brokerRows = [
  { broker: 'b-1', zone: 'us-west-2a', status: 'Healthy', msgIn: 984, msgOut: 811 },
  { broker: 'b-2', zone: 'us-west-2b', status: 'Healthy', msgIn: 1021, msgOut: 845 },
  { broker: 'b-3', zone: 'us-west-2c', status: 'Rebalancing', msgIn: 912, msgOut: 776 },
]

const initialSeries = {
  uptime: [99.7, 99.8, 99.8, 99.9, 99.9, 99.95, 99.95],
  msgIn: [320, 390, 440, 520, 610, 720, 780],
  msgOut: [300, 365, 420, 498, 590, 700, 760],
}

function buildSparkline(values: number[], width = 180, height = 48) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')
}

function getDiscordPreviewColors() {
  if (typeof document === 'undefined') {
    return {
      background: '#313338',
      text: '#dbdee1',
      textMuted: '#949ba4',
      label: '#80848e',
      cardBg: 'rgba(255,255,255,0.03)',
      border: 'rgba(255,255,255,0.08)',
      accent: '#5865F2',
    }
  }
  const root = document.documentElement
  const s = getComputedStyle(root)
  return {
    background: s.getPropertyValue('--discord-chat').trim() || '#313338',
    text: s.getPropertyValue('--discord-text-primary').trim() || '#dbdee1',
    textMuted: s.getPropertyValue('--discord-text-secondary').trim() || '#949ba4',
    label: s.getPropertyValue('--discord-text-muted').trim() || '#80848e',
    cardBg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.08)',
    accent: s.getPropertyValue('--discord-blurple').trim() || '#5865F2',
  }
}

function buildMonitoringPreviewHtml({
  uptimeValue,
  msgInValue,
  msgOutValue,
  uptimePoints,
  msgInPoints,
  msgOutPoints,
  colors,
}: {
  uptimeValue: number
  msgInValue: number
  msgOutValue: number
  uptimePoints: string
  msgInPoints: string
  msgOutPoints: string
  colors?: ReturnType<typeof getDiscordPreviewColors>
}) {
  const c = colors ?? {
    background: '#0f1218',
    text: '#cdd7e3',
    textMuted: '#8a95a7',
    label: '#8a95a7',
    cardBg: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.08)',
    accent: '#73b9ff',
  }
  const brokerRowsHtml = brokerRows
    .map(
      (row) => `<tr>
        <td>${row.broker}</td>
        <td>${row.zone}</td>
        <td>${row.status}</td>
        <td class="num">${row.msgIn}</td>
        <td class="num">${row.msgOut}</td>
      </tr>`
    )
    .join('')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        background: ${c.background};
        color: ${c.text};
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 12px;
      }
      .title {
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: ${c.label};
        margin-bottom: 10px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .card {
        border-radius: 10px;
        background: ${c.cardBg};
        padding: 8px;
      }
      .label {
        font-size: 10px;
        color: ${c.label};
      }
      .value {
        margin-top: 2px;
        font-size: 20px;
        line-height: 1;
        font-weight: 600;
        color: ${c.text};
      }
      svg {
        width: 100%;
        height: 42px;
        margin-top: 6px;
      }
      polyline {
        fill: none;
        stroke: ${c.accent};
        stroke-width: 2;
      }
      .table-wrap {
        margin-top: 12px;
        border-top: 1px solid ${c.border};
        padding-top: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }
      th {
        color: ${c.label};
        font-weight: 500;
        text-align: left;
        padding: 6px;
        border-bottom: 1px solid ${c.border};
      }
      td {
        color: ${c.text};
        padding: 6px;
        border-bottom: 1px solid ${c.border};
      }
      td.num, th.num {
        text-align: right;
      }
    </style>
  </head>
  <body>
    <p class="title">Monitoring</p>
    <div class="grid">
      <div class="card">
        <p class="label">Broker Uptime</p>
        <p class="value">${uptimeValue}%</p>
        <svg viewBox="0 0 180 48">
          <polyline points="${uptimePoints}" />
        </svg>
      </div>
      <div class="card">
        <p class="label">Message In/s</p>
        <p class="value">${msgInValue}</p>
        <svg viewBox="0 0 180 48">
          <polyline points="${msgInPoints}" />
        </svg>
      </div>
      <div class="card">
        <p class="label">Message Out/s</p>
        <p class="value">${msgOutValue}</p>
        <svg viewBox="0 0 180 48">
          <polyline points="${msgOutPoints}" />
        </svg>
      </div>
    </div>
    <div class="table-wrap">
      <p class="title">Kafka Brokers</p>
      <table>
        <thead>
          <tr>
            <th>Broker</th>
            <th>AZ</th>
            <th>Status</th>
            <th class="num">In/s</th>
            <th class="num">Out/s</th>
          </tr>
        </thead>
        <tbody>
          ${brokerRowsHtml}
        </tbody>
      </table>
    </div>
    <script>
      (function(){
        function reportHeight(){
          var h = document.documentElement.scrollHeight;
          try { window.parent.postMessage({ type: 'kafka-preview-height', height: h }, '*'); } catch(e){}
        }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reportHeight);
        else reportHeight();
      })();
    </script>
  </body>
</html>`
}

export function KafkaDeploymentExperienceCard({ className }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(1)
  const [isAutoplay, setIsAutoplay] = useState(true)
  const [series, setSeries] = useState(initialSeries)
  const [previewHeight, setPreviewHeight] = useState(320)

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'kafka-preview-height' && typeof e.data.height === 'number') {
        setPreviewHeight(e.data.height + 2)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  useEffect(() => {
    if (!isAutoplay) return
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % deploymentSteps.length)
    }, 2600)

    return () => window.clearInterval(timer)
  }, [isAutoplay])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeries((prev) => {
        const nextUptime = Math.min(
          99.99,
          Math.max(99.6, prev.uptime[prev.uptime.length - 1] + (Math.random() - 0.45) * 0.08)
        )
        const nextMsgIn = Math.max(280, prev.msgIn[prev.msgIn.length - 1] + (Math.random() * 120 - 35))
        const nextMsgOut = Math.max(260, prev.msgOut[prev.msgOut.length - 1] + (Math.random() * 110 - 40))

        return {
          uptime: [...prev.uptime.slice(1), Number(nextUptime.toFixed(2))],
          msgIn: [...prev.msgIn.slice(1), Math.round(nextMsgIn)],
          msgOut: [...prev.msgOut.slice(1), Math.round(nextMsgOut)],
        }
      })
    }, 1500)

    return () => window.clearInterval(timer)
  }, [])

  const currentStep = deploymentSteps[activeStep]
  const uptimeValue = series.uptime[series.uptime.length - 1]
  const msgInValue = series.msgIn[series.msgIn.length - 1]
  const msgOutValue = series.msgOut[series.msgOut.length - 1]
  const previewColors = getDiscordPreviewColors()
  const monitoringHtml = buildMonitoringPreviewHtml({
    uptimeValue,
    msgInValue,
    msgOutValue,
    uptimePoints: buildSparkline(series.uptime),
    msgInPoints: buildSparkline(series.msgIn),
    msgOutPoints: buildSparkline(series.msgOut),
    colors: previewColors,
  })

  return (
    <div className={cn('w-full max-w-[560px]', className)}>
      <div className="rounded-2xl bg-transparent p-3 lg:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-discord-text-muted/80">
              Kafka Nimbus Control Plane
            </p>
            <h4 className="text-xl font-semibold text-discord-text-primary">
              MSK Deployment Simulator
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setIsAutoplay((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] text-discord-text-secondary hover:text-discord-text-primary"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            {isAutoplay ? 'Pause autoplay' : 'Resume autoplay'}
          </button>
        </div>

        <div className="rounded-xl bg-transparent p-2 space-y-2">
          <Timeline>
            {deploymentSteps.map((step, index) => (
              <TimelineItem
                key={step.id}
                title={step.title}
                status={
                  index === activeStep
                    ? 'in-progress'
                    : index < activeStep
                      ? 'completed'
                      : 'pending'
                }
                isLast={index === deploymentSteps.length - 1}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </Timeline>
          <div className="rounded-lg bg-transparent px-1 py-1">
            <p className="text-xs text-discord-text-primary">{currentStep.subtitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-discord-text-primary">{currentStep.detail}</p>
          </div>
        </div>

        <div className="rounded-xl bg-transparent p-2 h-[400px]">

          <WebPreview
            defaultUrl="https://kafka-nimbus.local/monitoring"
            className="overflow-hidden rounded-xl border-discord-divider bg-discord-chat h-full"
          >
            <WebPreviewNavigation className="gap-1 border-discord-divider bg-discord-dark p-1.5">
              <WebPreviewNavigationButton tooltip="Back">
                <span className="text-[10px] text-discord-text-muted">{'<'}</span>
              </WebPreviewNavigationButton>
              <WebPreviewNavigationButton tooltip="Forward">
                <span className="text-[10px] text-discord-text-muted">{'>'}</span>
              </WebPreviewNavigationButton>
              <WebPreviewNavigationButton tooltip="Reload">
                <span className="text-[10px] text-discord-text-muted">{'R'}</span>
              </WebPreviewNavigationButton>
              <WebPreviewUrl
                className="h-7 border-discord-divider bg-discord-hover text-xs text-discord-text-muted placeholder:text-discord-text-muted"
                readOnly
              />
            </WebPreviewNavigation>
            <WebPreviewBody className="border-0" srcDoc={monitoringHtml} />
          </WebPreview>
        </div>

      </div>
    </div>
  )
}

export function KafkaDeploymentExperienceShowcase({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row gap-6 rounded-2xl border border-discord-divider bg-discord-dark p-4 lg:p-6',
        className
      )}
    >
      <div className="lg:w-1/3 flex min-h-0 flex-col gap-6 text-sm lg:min-h-[520px]">
        {/* Header: icon + title, then description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-sky-400/90 shrink-0" />
            <h3 className="text-2xl font-semibold text-discord-text-primary">
              Kafka Nimbus Deployment Experience
            </h3>
          </div>
          <p className="text-sm text-discord-text-secondary leading-relaxed">
            Open Source Labs (Kafka Nimbus) - GUI for deploying Kafka Clusters to the cloud.
            This showcase simulates the operator dashboard I built around Next.js App Router
            patterns, Prometheus metrics, Grafana-style monitoring, and AWS-SDK MSK management.
          </p>
        </div>

        {/* CTA button */}
        <Button
          variant="outline"
          className="w-fit rounded-full border-white/20 bg-white/5 text-discord-text-primary hover:bg-white/10 hover:text-white"
        >
          Explore Kafka Nimbus
        </Button>

        {/* Steps at bottom */}
        <div className="mt-auto flex flex-col">
          <span className="text-sm font-medium text-discord-text-primary">
            Create cluster request
          </span>
          <div className="mt-3 border-t border-discord-divider" />

          <span className="mt-4 text-sm font-medium text-discord-text-primary">
            Provision brokers &amp; networking
          </span>
          <div className="mt-3 border-t border-discord-divider" />

          <div className="mt-4">
            <span className="text-sm font-medium text-discord-text-primary">
              Validate at scale
            </span>
            <p className="mt-1.5 text-xs text-discord-text-secondary leading-relaxed">
              Review broker health, run metrics across the cluster, and confirm throughput.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex justify-center min-h-[520px] rounded-xl overflow-hidden">
        {/* Background image: gamer / neon tech aesthetic */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
          style={{
            backgroundImage: `url(https://cdnb.artstation.com/p/assets/images/images/063/613/367/4k/mari-shot5-00000-copy-00000-copy.jpg?1685961874)`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 rounded-xl bg-linear-to-t from-transparent via-discord-dark/40 to-discord-dark/90" aria-hidden />
        <div className="relative z-10 flex items-center justify-center py-6">
          <KafkaDeploymentExperienceCard />
        </div>
      </div>
    </div>
  )
}
