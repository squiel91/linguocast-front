import { Textarea } from "@/ui/textarea.ui"
import { IEditFreeResponseExercise } from "../types.exercises"

export interface Props {
  exercise: IEditFreeResponseExercise
  onChange: (exercise: (exercise: IEditFreeResponseExercise) => IEditFreeResponseExercise) => void
}

export const FreeResponse = ({ exercise, onChange: changeDispatch }: Props) => {

  const { question, response: responseModel } = exercise

  return (
    <>
      <div>
        <div className="text-sm mb-1">Question</div>
        <Textarea
          value={question}
          onChange={(value) => changeDispatch(exercise => ({ ...exercise, question: value ?? '' }))}
          minRows={1}
        />
      </div>
      <div>
        <div className="text-sm mb-1">Answer model</div>
        <Textarea
          value={responseModel}
          onChange={(value) => changeDispatch(exercise => ({ ...exercise, response: value ?? '' }))}
        />
      </div>
    </>
  )
}