import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Redirect to channels - will show @me (DMs) or first server
    throw redirect({ to: '/channels/@me' })
  },
  component: () => null,
})
