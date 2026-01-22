import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { useState, useEffect } from 'react'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string

// Create client only once on the client side
let convexClient: ConvexReactClient | null = null

function getConvexClient() {
  if (typeof window === 'undefined') {
    return null
  }
  if (!convexClient && CONVEX_URL) {
    convexClient = new ConvexReactClient(CONVEX_URL)
  }
  return convexClient
}

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [client, setClient] = useState<ConvexReactClient | null>(null)

  useEffect(() => {
    const convex = getConvexClient()
    if (convex) {
      setClient(convex)
    } else if (!CONVEX_URL) {
      console.error('Missing VITE_CONVEX_URL environment variable')
    }
  }, [])

  // During SSR or before client is ready, render children without Convex
  if (!client) {
    return <>{children}</>
  }

  return (
    <ConvexProvider client={client}>
      {children}
    </ConvexProvider>
  )
}
