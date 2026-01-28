export type GitHubEmbed = {
  type: 'github'
  color?: string
  authorName: string
  authorAvatarUrl?: string
  repoName: string
  branchName: string
  title: string
  titleUrl: string
  description?: string
  commitHash?: string
  commitUrl?: string
  footerText?: string
  footerIconUrl?: string
  timestamp?: number
}

export type MediaPayload = {
  title: string
  caption: string
  tags: string[]
  externalUrl?: string
  images: string[]
}

export type AudioPayload = {
  id: string
  title: string
  artist: string
  duration: number
  cover?: string
  storageId?: string
  url?: string
}
