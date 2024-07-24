import { Card } from "@/ui/card.ui"
import { IEditExercise } from "./types.exercises"
import { MultipleChoice } from "./edits/multiple-choice.exercises.edit.episode"
import { FreeResponse } from "./edits/free-response.exercises.edit.episode"
import { SelectMultiple } from "./edits/select-multiple.exercises.edit.episode"
import { EmbeddedTimeSelector } from "@/components/embedded-time-selector"
import { Checkbox } from "@/ui/checkbox.ui"
import { ScanSearch, Trash2Icon } from "lucide-react"
import { capitalize } from "@/utils/text.utils"

export interface Props {
  exercise: IEditExercise
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (exercise: (exercise: any) => any) => void
  onCheckResponses: () => void
  onRemove: () => void
}

export const EditExercise = ({
  exercise,
  onChange: changeDispatch,
  onCheckResponses: checkResposnesHandler,
  onRemove: removeHandler
}: Props) => (
  <Card className="flex flex-col gap-4 p-6">
    <div className="flex items-center  gap-2 flex-wrap">
      <div className="font-bold gap-2 grow">
        {capitalize(exercise.type.split('-').join(' '))}
      </div>
      {(exercise.responsesCount ?? 0) > 0 && (
        <button onClick={checkResposnesHandler} className="rounded-md flex gap-2 px-3 py-2 items-center text-primary hover:bg-slate-100">
          <ScanSearch size={20} />
          {exercise.responsesCount} response{exercise.responsesCount === 1 ? '' : 's'}
        </button>
      )}
      {(exercise.responsesCount ?? 0) === 0 && (
        <button onClick={removeHandler} className="p-2 rounded-md text-primary hover:bg-slate-100">
          <Trash2Icon size={20} />
        </button>
      )}
    </div>
    {exercise.type === 'multiple-choice' && (
      <MultipleChoice
        exercise={exercise}
        onChange={changeDispatch}
      />
    )}
    {exercise.type === 'select-multiple' && (
      <SelectMultiple
        exercise={exercise}
        onChange={changeDispatch}
      />
    )}
    {exercise.type === 'free-response' && (
      <FreeResponse
        exercise={exercise}
        onChange={changeDispatch}
      />
    )}
    <hr />
    <label className="flex gap-3 items-center text-sm">
      <Checkbox
        checked={typeof exercise.start === 'number'}
        onChange={checked => {
          if (checked) {
            changeDispatch(exercise => ({ ...exercise, start: 0, duration: 15 }))
          } else {
            changeDispatch(exercise => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { start, duration, ...restWithoutStartAndDuration} = exercise
              return restWithoutStartAndDuration
            })
          }
        }}
      />
      Show at a specific time
    </label>          
    {(typeof exercise.start === 'number') && (
      <EmbeddedTimeSelector
        start={exercise.start ?? 0}
        duration={exercise.duration ?? 15}
        onStartChange={start => changeDispatch(exercise => ({ ...exercise, start }))}
        onDurationChange={duration => changeDispatch(exercise => ({ ...exercise, duration }))}
      />
    )}
  </Card>
)