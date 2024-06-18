export interface BaseEmbedded {
  id?: number,
  start: number,
  duration: number
}

export interface NoteEmbedded extends BaseEmbedded {
  type: 'note'
  content: string
}

export interface LinkEmbedded extends BaseEmbedded {
  type: 'link'
  url: string
}

export interface ImageEmbedded extends BaseEmbedded {
  type: 'image'
  image: string
}

export interface EpisodeEmbedded extends BaseEmbedded {
  type: 'episode'
  episodeId: number | null
}

export interface WordEmbedded extends BaseEmbedded {
  type: 'word'
  wordId: number | null
}

export interface ExerciseEmbedded extends BaseEmbedded {
  type: 'exercise'
  exerciseId: number 
}

export type Embedded = NoteEmbedded | LinkEmbedded | ImageEmbedded | EpisodeEmbedded | WordEmbedded | ExerciseEmbedded
