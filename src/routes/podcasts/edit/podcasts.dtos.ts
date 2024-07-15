export interface RawEpisodeReproduction {
  reproductions: {
    leftOn: number
    completedAt: string | null
    updatedAt: string
    userId: number
    episodeId: number
  }[]
  episodes: {
    id: number
    title: string
    image: string | null
    duration: number
  }[]
}