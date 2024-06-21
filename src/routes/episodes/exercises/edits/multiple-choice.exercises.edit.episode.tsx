import { Button } from "@/ui/button.ui"
import { Input } from "@/ui/input.ui"
import { Textarea } from "@/ui/textarea.ui"
import { CheckIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { IEditMultipleChoiceExercise } from "../types.exercises"

export interface Props {
  exercise: IEditMultipleChoiceExercise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (exercise: (exercise: any) => any) => void
  onRemove: () => void
}

export const MultipleChoice = ({ exercise, onChange: changeDispatch, onRemove }: Props) => {

  const { question, correctChoice, incorrectChoices } = exercise

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold">Multiple Choice</div>
        <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
      </div>
      <div>
        <div className="text-sm mb-1">Incorrect answers</div>
        <Textarea
          value={question}
          onChange={(value) => changeDispatch(exercise => ({ ...exercise, question: value ?? '' }))}
          minRows={1}
        />
      </div>
      <Input
        value={correctChoice}
        label="Correct answer"
        onChange={(value) => changeDispatch(exercise => ({ ...exercise, correctChoice: value ?? '' }))}
        className="flex-grow"
        prepend={<CheckIcon size={16} />}
      />
      <div>
        <div className="text-sm mb-1">Incorrect answers</div>
        <ul className="flex flex-col gap-4">
          {incorrectChoices.map((incorrectChoice, index) => (
            <li key={index} className="flex gap-2 items-center w-full">
              <Input
                value={incorrectChoice}
                onChange={(value) => changeDispatch(
                  (exercise) => ({
                    ...exercise,
                    incorrectChoices: exercise
                      .incorrectChoices
                      .map((_: unknown, i: number) => i === index ? value ?? '' : _)
                  })
                )}
                className="flex-grow"
                prepend={<XIcon size={16} />}
              />
              <button
                className="text-primary p-2 disabled:opacity-40"
                onClick={() => changeDispatch(
                  exercise => ({
                    ...exercise,
                    incorrectChoices: exercise
                      .incorrectChoices
                      .filter((_: unknown, i: unknown) => i !== index)
                  })
                )}
                disabled={incorrectChoices.length === 1}
              >
                <Trash2Icon size={20} />
              </button>
            </li>
          ))}
          <Button
            onClick={() => changeDispatch(
              exercise => ({
                ...exercise,
                incorrectChoices: exercise.incorrectChoices.concat('')
              })
            )}
            prepend={<PlusIcon size={16} />}
            className="self-start"
            compact
          >
            Add incorrect choice
          </Button>
        </ul>
      </div>
    </>
  )
}