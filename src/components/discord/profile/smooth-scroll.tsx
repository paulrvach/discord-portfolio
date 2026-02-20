import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

interface SmoothScrollProps {
  children: React.ReactNode
  className?: string
}

const SNAP_DEBOUNCE_MS = 150

export function SmoothScroll({ children, className }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [contentHeight, setContentHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const scrollTarget = useRef(0)

  const scrollY = useMotionValue(0)
  const smoothY = useSpring(scrollY, {
    damping: 20,
    stiffness: 80,
    mass: 0.5,
  })

  useEffect(() => {
    const content = contentRef.current
    const container = containerRef.current
    if (!content || !container) return

    const update = () => {
      setContentHeight(content.scrollHeight)
      setContainerHeight(container.clientHeight)
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(content)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  const snapToNearestHeader = useCallback(() => {
    const content = contentRef.current
    if (!content) return

    const headers = content.querySelectorAll("header")
    if (headers.length === 0) return

    const maxScroll = Math.max(0, contentHeight - containerHeight)
    const current = scrollTarget.current
    let nearestOffset = current
    let nearestDist = Infinity

    headers.forEach((header) => {
      const offset = Math.min(header.offsetTop, maxScroll)
      const dist = Math.abs(current - offset)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestOffset = offset
      }
    })

    if (nearestDist > 0 && nearestDist < containerHeight * 0.4) {
      scrollTarget.current = nearestOffset
      scrollY.set(-nearestOffset)
    }
  }, [contentHeight, containerHeight, scrollY])

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const maxScroll = Math.max(0, contentHeight - containerHeight)
      if (maxScroll <= 0) return

      e.preventDefault()

      scrollTarget.current = Math.min(
        Math.max(scrollTarget.current + e.deltaY, 0),
        maxScroll,
      )

      scrollY.set(-scrollTarget.current)

      if (snapTimer.current) clearTimeout(snapTimer.current)
      snapTimer.current = setTimeout(snapToNearestHeader, SNAP_DEBOUNCE_MS)
    },
    [contentHeight, containerHeight, scrollY, snapToNearestHeader],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

  useEffect(() => {
    return () => {
      if (snapTimer.current) clearTimeout(snapTimer.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <motion.div
        ref={contentRef}
        style={{
          y: smoothY,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
