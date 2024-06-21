import { Button } from "@/ui/button.ui"
import { Input } from "@/ui/input.ui"
import { Textarea } from "@/ui/textarea.ui"
import { CheckIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { IEditSelectMultipleExercise } from "../types.exercises"

export interface Props {
  exercise: IEditSelectMultipleExercise
  onChange: (exercise: (exercise: IEditSelectMultipleExercise) => IEditSelectMultipleExercise) => void
  onRemove: () => void
}

export const SelectMultiple = ({ exercise, onChange: changeDispatch, onRemove }: Props) => {

  const { question, correctChoices, incorrectChoices } = exercise

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold">Select multiple</div>
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
      <div>
        <div className="text-sm mb-1">Correct answers</div>
        <ul className="flex flex-col gap-4">
          {correctChoices.map((incorrectChoice, index) => (
            <li key={index} className="flex gap-2 items-center w-full">
              <Input
                value={incorrectChoice}
                onChange={(value) => changeDispatch(
                  exercise => ({
                    ...exercise,
                    correctChoices: exercise
                      .correctChoices
                      .map((_, i) => i === index ? value ?? '' : _)
                  })
                )}
                className="flex-grow"
                prepend={<CheckIcon size={16} />}
              />
              <button
                className="text-primary p-2 disabled:opacity-40"
                onClick={() => changeDispatch(
                  exercise => ({
                    ...exercise,
                    correctChoices: exercise
                      .correctChoices
                      .filter((_, i) => i !== index)
                  })
                )}
                disabled={correctChoices.length === 1}
              >
                <Trash2Icon size={20} />
              </button>
            </li>
          ))}
          <Button
            onClick={() => changeDispatch(
              exercise => ({
                ...exercise,
                correctChoices: exercise.correctChoices.concat('')
              })
            )}
            prepend={<PlusIcon size={16} />}
            className="self-start"
            compact
          >
            Add correct choice
          </Button>
        </ul>
      </div>
      <div>
        <div className="text-sm mb-1">Incorrect answers</div>
        { incorrectChoices.length === 0
          ? <p className="italic text-sm text-slate-400">There are no incorrect answers.</p>
          : (
            <ul className="flex flex-col gap-4">
              {incorrectChoices.map((incorrectChoice, index) => (
                <li key={index} className="flex gap-2 items-center w-full">
                  <Input
                    value={incorrectChoice}
                    onChange={(value) => changeDispatch(
                      exercise => ({
                        ...exercise,
                        incorrectChoices: exercise
                          .incorrectChoices
                          .map((_, i) => i === index ? value ?? '' : _)
                      })
                    )}
                    className="flex-grow"
                    prepend={<XIcon size={16} />}
                  />
                  <button
                    className="text-primary p-2"
                    onClick={() => changeDispatch(
                      exercise => ({
                        ...exercise,
                        incorrectChoices: exercise
                          .incorrectChoices
                          .filter((_, i) => i !== index)
                      })
                    )}
                  >
                    <Trash2Icon size={20} />
                  </button>
                </li>
              ))}
            </ul>
          )
        }
        <Button
          onClick={() => changeDispatch(
            exercise => ({
              ...exercise,
              incorrectChoices: exercise.incorrectChoices.concat('')
            })
          )}
          prepend={<PlusIcon size={16} />}
          className="self-start mt-4"
          compact
        >
          Add incorrect choice
        </Button>
      </div>
    </>
  )
}