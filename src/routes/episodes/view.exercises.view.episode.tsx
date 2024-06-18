import { MultipleChoiceExercise } from "./exercises/edit.exercises.edit.episode"

interface Props {
  exercise: MultipleChoiceExercise
}
export const ViewExercise = ({ exercise }: Props) => {
  return (
    <div>
      <div className="text-sm text-slate-400 mb-2">Multiple-choice</div>
      <p className="mb-2">{exercise.question}</p>
      <ul className="flex gap-1 flex-col">
        <li><label><input type="radio" /> {exercise.correctChoice}</label></li>
        {exercise.incorrectChoices.map(incorrectChoice => (
          <li><label><input type="radio" /> {incorrectChoice}</label></li>
        ))}
      </ul>
    </div>
  )
}