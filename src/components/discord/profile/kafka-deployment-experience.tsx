import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  BarChart3,
  Cloud,
  Cpu,
  Database,
  PlayCircle,
  Sparkles,
  Workflow,
} from 'lucide-react'
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

function buildMonitoringPreviewHtml({
  uptimeValue,
  msgInValue,
  msgOutValue,
  uptimePoints,
  msgInPoints,
  msgOutPoints,
}: {
  uptimeValue: number
  msgInValue: number
  msgOutValue: number
  uptimePoints: string
  msgInPoints: string
  msgOutPoints: string
}) {
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
        background: #0f1218;
        color: #cdd7e3;
        font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 12px;
      }
      .title {
        font-size: 10px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #8a95a7;
        margin-bottom: 10px;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }
      .card {
        border-radius: 10px;
        background: rgba(255,255,255,0.03);
        padding: 8px;
      }
      .label {
        font-size: 10px;
        color: #8a95a7;
      }
      .value {
        margin-top: 2px;
        font-size: 20px;
        line-height: 1;
        font-weight: 600;
        color: #dbe8f7;
      }
      svg {
        width: 100%;
        height: 42px;
        margin-top: 6px;
      }
      polyline {
        fill: none;
        stroke: #73b9ff;
        stroke-width: 2;
      }
      .table-wrap {
        margin-top: 12px;
        border-top: 1px solid rgba(255,255,255,0.08);
        padding-top: 10px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }
      th {
        color: #8a95a7;
        font-weight: 500;
        text-align: left;
        padding: 6px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      td {
        color: #cdd7e3;
        padding: 6px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
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
  const monitoringHtml = buildMonitoringPreviewHtml({
    uptimeValue,
    msgInValue,
    msgOutValue,
    uptimePoints: buildSparkline(series.uptime),
    msgInPoints: buildSparkline(series.msgIn),
    msgOutPoints: buildSparkline(series.msgOut),
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
            <p className="text-xs text-discord-text-muted">{currentStep.subtitle}</p>
            <p className="mt-1 text-sm leading-relaxed text-discord-text-secondary">{currentStep.detail}</p>
          </div>
        </div>

        <div className="rounded-xl bg-transparent p-2 h-[400px]">

          <WebPreview
            defaultUrl="https://kafka-nimbus.local/monitoring"
            className="overflow-hidden rounded-xl border-white/10 bg-[#0b0d12] h-full"
          >
            <WebPreviewNavigation className="gap-1 border-white/10 bg-white/5 p-1.5">
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
                className="h-7 border-white/10 bg-[#0f1218] text-xs text-discord-text-muted"
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
      <div className="lg:w-[42%] space-y-4 text-sm text-discord-text-secondary">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-discord-text-muted">
            Open Source Labs
          </p>
          <h3 className="text-xl font-semibold text-discord-text-primary">
            Kafka Nimbus Deployment Experience
          </h3>
        </div>

        <p className="leading-relaxed">
          Open Source Labs (Kafka Nimbus) - GUI for deploying Kafka Clusters to the cloud.
          This showcase simulates the operator dashboard I built around Next.js App Router
          patterns, Prometheus metrics, Grafana-style monitoring, and AWS-SDK MSK management.
        </p>


        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-discord-blurple/50 bg-transparent px-2 py-1 text-xs text-discord-blurple">
            <Workflow className="h-3.5 w-3.5 text-discord-blurple" />
            Next.js App Router model
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/50 bg-transparent px-2 py-1 text-xs text-sky-300">
            <Cloud className="h-3.5 w-3.5 text-sky-300" />
            AWS-SDK + MSK
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-transparent px-2 py-1 text-xs text-cyan-300">
            <BarChart3 className="h-3.5 w-3.5 text-sky-300" />
            Prometheus/Grafana
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-transparent px-2 py-1 text-xs text-emerald-300">
            <Database className="h-3.5 w-3.5 text-emerald-300" />
            MongoDB + ORM
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-300/50 bg-transparent px-2 py-1 text-xs text-fuchsia-300">
            <Cpu className="h-3.5 w-3.5 text-fuchsia-300" />
            <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
            tRPC type safety
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center lg:justify-end">
        <KafkaDeploymentExperienceCard />
      </div>
    </div>
  )
}
