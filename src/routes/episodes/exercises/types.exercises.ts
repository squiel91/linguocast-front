interface QuestionAndTiming {
  question: string
  start?: number
  duration?: number
}

interface ResponsesCount {
  responsesCount?: number
  correctCount?: number
}

// Editions
interface OptionalId {
  // Creations does not have an Id yet
  id?: number
}

export interface IEditMultipleChoiceExercise  extends OptionalId, QuestionAndTiming, ResponsesCount {
  type: 'multiple-choice'
  correctChoice: string
  incorrectChoices: string[]
}

export interface IEditSelectMultipleExercise  extends OptionalId, QuestionAndTiming, ResponsesCount {
  type: 'select-multiple'
  correctChoices: string[]
  incorrectChoices: string[]
}

export interface IEditFreeResponseExercise extends OptionalId, QuestionAndTiming, ResponsesCount {
  type: 'free-response'
  response: string
}

export type IEditExercise = 
  | IEditMultipleChoiceExercise
  | IEditSelectMultipleExercise
  | IEditFreeResponseExercise

export interface ExerciseResponse {
  score: number
  response: string | number[] | number
  feedback?: string
  createdAt: string
  userId: number
  userName: string
  userAvatar: string | null
}
// Views
interface IdAndPartialResponse extends QuestionAndTiming {
  id: number
  score?: number,
  respondedAt?: string,
}

interface ViewChoicesBaseExercise extends IdAndPartialResponse {
  choices: string[]
}

export interface IViewMultipleChoiceExercise extends ViewChoicesBaseExercise {
  type: 'multiple-choice'
  choices: string[]
  response?: number
  feedback?: number
}

export interface IViewSelectMultipleExercise extends ViewChoicesBaseExercise {
  type: 'select-multiple'
  choices: string[]
  response?: number[]
  feedback?: number[]
}

export interface IViewFreeResponseExercise extends IdAndPartialResponse {
  type: 'free-response'
  response: string
  feedback?: string
}

export type IViewExercise =
  | IViewMultipleChoiceExercise
  | IViewSelectMultipleExercise
  | IViewFreeResponseExercise
