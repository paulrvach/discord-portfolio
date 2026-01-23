import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { ExternalLink } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ImageZoom } from '~/packages/image-zoom'
import type { MediaPayload } from './message-types'

interface MediaMessageProps {
  media: MediaPayload
}

export function MediaMessage({ media }: MediaMessageProps) {
  if (!media.images.length) return null

  const autoplay = React.useRef<ReturnType<typeof Autoplay>>(
    Autoplay({ delay: 4500, stopOnInteraction: true })
  )
  const hasMultipleImages = media.images.length > 1

  const handleMouseEnter = () => autoplay.current?.stop?.()
  const handleMouseLeave = () => autoplay.current?.reset?.()

  return (
    <div className="mt-2 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-discord-text-primary">
          {media.title}
        </h3>
        {media.externalUrl && (
          <a
            href={media.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-discord-text-muted hover:text-discord-text-primary"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View
          </a>
        )}
      </div>

      <p className="text-sm text-discord-text-secondary leading-relaxed">
        {media.caption}
      </p>

      {media.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {media.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-discord-hover text-discord-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div
        className="relative max-w-2xl"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {hasMultipleImages ? (
          <Carousel plugins={[autoplay.current]} className="w-full">
            <CarouselContent className="ml-0">
              {media.images.map((src, index) => (
                <CarouselItem key={`${src}-${index}`} className="pl-0">
                  <ImageZoom zoomMargin={20} >
                    <img
                      src={src}
                      alt={`${media.title} ${index + 1}`}
                      className="aspect-video w-full rounded-md border border-discord-divider object-cover"
                      loading="lazy"
                    />
                  </ImageZoom>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        ) : (
          <ImageZoom zoomMargin={20}>
            <img
              src={media.images[0]}
            
              alt={media.title}
              className="aspect-video w-full rounded-md border border-discord-divider object-cover"
              loading="lazy"
            />
          </ImageZoom>
        )}
      </div>
    </div>
  )
}
