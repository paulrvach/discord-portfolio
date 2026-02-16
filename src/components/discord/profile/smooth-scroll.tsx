import { useRef, useState, useCallback, useEffect } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

interface SmoothScrollProps {
  children: React.ReactNode
  className?: string
}

export function SmoothScroll({ children, className }: SmoothScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [contentHeight, setContentHeight] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  // Current "real" scroll target (updated instantly on wheel)
  const scrollTarget = useRef(0)

  // Motion value that the spring will chase
  const scrollY = useMotionValue(0)
  const smoothY = useSpring(scrollY, {
    damping: 20,
    stiffness: 80,
    mass: 0.5,
  })

  // Measure content vs container heights so we know the max scroll
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

  // Wheel handler — updates the target and lets the spring chase it
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const maxScroll = Math.max(0, contentHeight - containerHeight)
      if (maxScroll <= 0) return // nothing to scroll

      e.preventDefault()

      scrollTarget.current = Math.min(
        Math.max(scrollTarget.current + e.deltaY, 0),
        maxScroll,
      )

      scrollY.set(-scrollTarget.current)
    },
    [contentHeight, containerHeight, scrollY],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [handleWheel])

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
