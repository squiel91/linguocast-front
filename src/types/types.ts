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
  variant: string | null
  level: typeof LEVELS[number]
  createdAt: string
}

export interface SelfUser extends PublicUser {
  email: string
  isPremium: boolean
  isCreator: boolean
  isAdmin: boolean
  isProfilePrivate: boolean
}

export interface MicroPodcast {
  id: number
  name: string
  coverImage?: string
  targetLanguage: string
  creatorId: number
}

export interface MinifiedPodcast extends MicroPodcast {
  description: string
  targetLanguage: string
  levels: Level[]
  savedCount: number
  commentsCount: number
  episodesCount: number
  lastEpisodeDate?: string
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

export interface CreatorsEpisodeDto {
  id: number
  title: string
  audio: string
  description: string
  transcript: string | null
  image: string | null
  duration: number
  isListed: boolean
  isPremium: boolean
  isFromRss: boolean
  podcast: {
    id: number
    name: string
    image: string
  }
}

export interface MinifiedEpisode {
  id: number
  title: string
  duration: number
  contentUrl: string
  image?: string
  podcastName: string
  podcastId: number
  podcastImage?: string
  targetLanguage: string
  creatorId: number
  publishedAt: string
  truncatedDescription: string
  hasTranscript: boolean
  leftOn: number
  isListed: boolean
  isPremium: boolean
  commentsCount: number,
  completedAt: string
}

export interface DetailedEpisode extends Omit<MinifiedEpisode, 'truncatedDescription' | 'hasTranscript'> {
  description: string
  transcript: string
}

export interface RawReproduction {
  leftOn: number
  completedAt: string | null
  updatedAt: string
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
  creatorId: number
  episodes: Episode[]
}

export interface ICompleteEpisode {
  id: number
  podcastId: number
  podcastName: string
  podcastImage: string | null
  title: string
  reproductionsCount: number
  commentsCount: number
  embeddedCount: number
  exercisesCount: number
  image: string | null
  duration: number
  publishedAt: string
  description: string
  transcript: string | null
  contentUrl: string
  isListed: number
  createdAt: string
  updatedAt: string
}

export interface ICompletePodcast {
  id: number
  name: string
  image: string | null
  description: string
  targetLanguage: string
  mediumLanguage: string
  levels: Level[]
  rss: string | null
  links: string[]
  episodesCount: number
  followersCount: number
  reviewsCount: number
  commentsCount: number
  uniqueReproductions: number
  isListed: boolean
  updatedAt: string
  createdAt: string
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

export interface ICreatorsComment {
  id: number,
  content: string
  createdAt: string
  updatedAt: string
  responseTo: number | null
  episode: {
    id: number,
    title: string,
    image: string | null
  },
  author: {
    id: number
    name: string
    avatar: string
  }
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
  level: number | null
  reviewScheduledFor: number
  lastReviewInterval: number
  saved: boolean
  measureWords: MeasureWord[]
}
