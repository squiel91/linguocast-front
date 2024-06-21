interface QuestionAndTiming {
  question: string
  start?: number
  duration?: number
}

// Editions
interface OptionalId {
  // Creations does not have an Id yet
  id?: number
}

export interface IEditMultipleChoiceExercise  extends OptionalId, QuestionAndTiming {
  type: 'multiple-choice'
  correctChoice: string
  incorrectChoices: string[]
}

export interface IEditSelectMultipleExercise  extends OptionalId, QuestionAndTiming {
  type: 'select-multiple'
  correctChoices: string[]
  incorrectChoices: string[]
}

export interface IEditFreeResponseExercise extends OptionalId, QuestionAndTiming {
  type: 'free-response'
  response: string
}

export type IEditExercise = 
  | IEditMultipleChoiceExercise
  | IEditSelectMultipleExercise
  | IEditFreeResponseExercise

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
