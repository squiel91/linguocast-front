import { LEVELS } from "@/constants/levels.constants"

export type Level = typeof LEVELS[number]

export interface Language {
  id: number
  name: string
}

export interface PrivateUser {
  id: number
  name: string
  avatar?: string
}

export interface PublicUser extends PrivateUser {
  canOthersContact: boolean
  learning: string
  level: typeof LEVELS[number]
  createdAt: string
}

export interface SelfUser extends PublicUser {
  email: string
  isPremium: boolean
  isAdmin: boolean
  isProfilePrivate: boolean
}

export interface MicroPodcast {
  id: number
  name: string
  coverImage?: string
  targetLanguage: string
}

export interface MinifiedPodcast extends MicroPodcast {
  description: string
  targetLanguage: string
  levels: Level[]
  savedCount: number
  commentsCount: number
}

export interface EpisodeSuccint {
  title: string
  podcastName: string
  image: string | null
}

export interface Episode {
  id: number
  title: string
  image?: string
  podcastName: string
  podcastImage?: string
  publishedAt: string
  duration: number
  leftOn?: number
  completedAt?: string
}

export interface PopulatedEpisode {
  id: number
  title: string
  duration: number
  contentUrl: string
  image?: string
  publishedAt: string
  description: string
  transcript?: string
  leftOn: number,
  commentsCount: number,
  completedAt: string
  belongsTo: MicroPodcast
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

export interface Comment {
  id: number
  authorId: number
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
  updatedAt?: string
}

export interface PoplulatedComment extends Comment {
  episodeId: number
  episodeTitle: string
  episodeImage: string
  podcastId: number
  podcastName: string
  podcastImage: string
}

export interface AutocompletePodcast {
  name: string | null
  description: string | null
  link: string | null
  coverImage: string | null
  targetLanguage: string | null
}


export interface MeasureWord {
  id: number
  word: string
  pronunciation: string
}

export interface Word {
  id: number
  language: string
  image: string
  word: string
  pronunciation: string
  translations: string[][]
  reviewScheduledFor: number
  lastReviewInterval: number
  saved: boolean
  measureWords: MeasureWord[]
}
