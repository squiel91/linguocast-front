import { Button } from "@/ui/button.ui"
import { Textarea } from "@/ui/textarea.ui"
import { Trash2Icon } from "lucide-react"
import { FreeResponseExercise } from "../types.exercises"

export interface Props {
  exercise: FreeResponseExercise
  onChange: (exercise: (exercise: FreeResponseExercise) => FreeResponseExercise) => void
  onRemove: () => void
}

export const FreeResponse = ({ exercise, onChange: changeDispatch, onRemove }: Props) => {

  const { question, response } = exercise

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold">Free Response</div>
        <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
      </div>
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
          value={response}
          onChange={(value) => changeDispatch(exercise => ({ ...exercise, response: value ?? '' }))}
        />
      </div>
    </>
  )
}