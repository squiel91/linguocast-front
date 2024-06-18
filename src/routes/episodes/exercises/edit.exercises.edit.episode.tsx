import { Card } from "@/ui/card.ui"
import { Exercise } from "./types.exercises"
import { MultipleChoice } from "./exercise-types/multiple-choice.exercises.edit.episode"
import { FreeResponse } from "./exercise-types/free-response.exercises.edit.episode"
import { SelectMultiple } from "./exercise-types/select-multiple.exercises.edit.episode"
import { EmbeddedTimeSelector } from "@/components/embedded-time-selector"
import { Checkbox } from "@/ui/checkbox.ui"
import { useState } from "react"

export interface Props {
  exercise: Exercise
  onChange: (exercise: (exercise: Exercise) => Exercise) => void
  onRemove: () => void
}

export const EditExercise = ({ exercise, onChange: changeDispatch, onRemove }: Props) => (
  <Card className="flex flex-col gap-4 p-6">
    {exercise.type === 'multiple-choice' && (
      <MultipleChoice
        exercise={exercise}
        onChange={changeDispatch}
        onRemove={onRemove}
      />
    )}
    {exercise.type === 'select-multiple' && (
      <SelectMultiple
        exercise={exercise}
        onChange={changeDispatch}
        onRemove={onRemove}
      />
    )}
    
    {exercise.type === 'free-response' && (
      <FreeResponse
        exercise={exercise}
        onChange={changeDispatch}
        onRemove={onRemove}
      />
    )}
    <hr />
    <label className="flex gap-4 items-center text-sm">
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
      Show at a specific time (as an embedded)
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