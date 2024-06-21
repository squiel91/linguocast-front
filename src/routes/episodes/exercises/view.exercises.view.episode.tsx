import { IViewExercise } from "./types.exercises"
import { ViewChoicesExercise } from "./views/choices.exercises"
import { ViewFreeResponseExercise } from "./views/free-response.exercises"

interface Props {
  exercise: IViewExercise
}
export const ViewExercise = ({ exercise }: Props) => { 
  return (
    <div className="text-xl">
      {(exercise.type === 'multiple-choice' || exercise.type === 'select-multiple') && <ViewChoicesExercise exercise={exercise} />}
      {exercise.type === 'free-response' && <ViewFreeResponseExercise exercise={exercise} />}
    </div>
  )
}