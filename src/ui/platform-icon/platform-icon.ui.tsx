import { cn } from '@/utils/styles.utils'
import { LinkIcon, RssIcon } from 'lucide-react'
import patreonIcon from './assets/patreon.svg'
import youtubeIcon from './assets/youtube.svg'
import spotifyIcon from './assets/spotify.svg'
import appleIcon from './assets/apple.svg'

export const PlatformIcon = ({ link, className }: { link: string, className?: string }) => {
  if (link.toLowerCase().includes('patreon')) {
    return <img src={patreonIcon} className={className} />
  } else if (link.toLowerCase().includes('youtube')) {
    return <img src={youtubeIcon} className={className} />
  } else if (link.toLowerCase().includes('apple')) {
    return <img src={appleIcon} className={className} />
  } else if (link.toLowerCase().includes('spotify')) {
    return <img src={spotifyIcon} className={className} />
  } else if (link.toLowerCase().includes('rss')) {
    return <RssIcon strokeWidth={4} className={cn('text-black', className)} />
  } else {
    return <LinkIcon className={cn('text-slate-500', className)} />
  }
}
