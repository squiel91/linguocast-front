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
}

export interface Podcast extends MinifiedPodcast {
  links: string[] 
  mediumLanguage: string
  episodeCount?: number
  isActive?: boolean
  since?: Date // first episode's date
  hasVideo?: boolean
  avarageEpisodeMinutesDuration?: number
  episodesCount?: number
  transcript?: {
    available: boolean
    format?: 'pdf' | 'video'
    paid?: boolean
  }
}
