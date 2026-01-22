import { httpRouter } from 'convex/server'
import { githubWebhook } from './github'

const http = httpRouter()

http.route({
  path: '/github/webhook',
  method: 'POST',
  handler: githubWebhook,
})

export default http
