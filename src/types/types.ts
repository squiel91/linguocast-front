import { LEVELS } from "@/constants/levels.constants"

export type Level = typeof LEVELS[number]

export interface Language {
  id: number
  name: string
}

export interface MinifiedPodcast {
  id: number
  name: string
  description: string
  coverImage?: string
  targetLanguage: string
  levels: Level[]
  savedCount: number
  commentsCount: number
}

export interface MinifiedEpisode {
  id: number
  title: string
  duration: number
  contentUrl: string
  image?: string
  publishedAt: string
}

export interface Episode extends MinifiedEpisode {
  description: string
}

export interface PopulatedEpisode extends Episode {
  description: string
  belongsTo: PopulatedPodcast
}

export interface Podcast extends MinifiedPodcast {
  links: string[] 
  mediumLanguage: string
  isActive?: boolean
  since?: Date // first episode's date
  hasVideo?: boolean
  avarageEpisodeMinutesDuration?: number
  episodesCount: number
  savedCount: number
  transcript?: {
    available: boolean
    format?: 'pdf' | 'video'
    paid?: boolean
  }
  isSavedByUser?: boolean
  episodes: Episode[]
}

export interface PopulatedPodcast extends Podcast {
  episodes: PopulatedEpisode[]
}

export interface Comment {
  id: number
  authorId: number
  authorName: string
  message: string
  createdAt: string
  updatedAt?: string
}

export interface AutocompletePodcast {
  name: string | null
  description: string | null
  link: string | null
  coverImage: string | null
  targetLanguage: string | null
}
