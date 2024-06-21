import { Button } from "@/ui/button.ui"
import { IViewMultipleChoiceExercise, IViewSelectMultipleExercise } from "../types.exercises"
import { cn } from "@/utils/styles.utils"
import { useEffect, useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { getReadablePosition } from "@/utils/numbers.utils"
import { readableJoin } from "@/utils/text.utils"

interface Props {
  exercise: IViewMultipleChoiceExercise | IViewSelectMultipleExercise
}

export const ViewChoicesExercise = ({ exercise }: Props) => {
  const [answers, setAnswers] = useState<number[]>([])
  const [correction, setCorrection] = useState<{ score: number, feedback: number[] } | null>(null)
  
  const { mutate: recordResponse, isPending } = useMutation({
    mutationKey: ['record-exercise-response', exercise.id ?? null],
    mutationFn: () => axios.post<{ score: number, feedback: number[] }>(
      `/api/exercises/${exercise.id}/responses`, { type: exercise.type, response: exercise.type === 'multiple-choice' ? answers[0] : answers}
    ).then(res => res.data),
    onSuccess: ({ score, feedback}) => {
      setCorrection({
        score,
        feedback: typeof feedback === 'number' ? [feedback] : feedback
      })
    },
    onError: (error) => {
      console.error(error)
      alert('There was an error saving your response. Please try again.')
    }
  })

  useEffect(() => {
    if ((exercise.response ?? null) === null) return
    const response = exercise.response
    setAnswers(typeof response === 'number' ? [response] : response as number[])

    const feedback = exercise.feedback!
    setCorrection({ score: exercise.score!, feedback: typeof feedback === 'number' ? [feedback] : feedback })
  }, [exercise])

  const isSingleSelect = exercise.type === 'multiple-choice'
  const choices = exercise.choices

  const checkAnswerButton = (
    <Button
      compact
      className="self-start text-base"
      onClick={recordResponse}
      isLoading={isPending}
      disabled={!!correction}
    >
      Check answer
    </Button>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
      <div className="flex flex-col justify-between">
        <div>
          <p className="mb-1">{exercise.question}</p>
          <div className="text-sm text-slate-400 mb-2 flex gap-2 items-center">Select the correct option <ArrowRightIcon className="hidden md:block" size={16} /></div>
        </div>
        {!correction && answers.length > 0 && <div className="hidden md:block">{checkAnswerButton}</div>}
      </div>
      <div>
        <ul className="flex gap-[.4rem] flex-col">
          {choices.map((choice, index) => (
            <li key={index}>
              <label className="flex gap-2">
                <input
                  type={isSingleSelect ? 'radio' : 'checkbox'}
                  checked={answers.includes(index)}
                  onClick={() => {
                    if (isSingleSelect) setAnswers([index])
                    else setAnswers(v => v.includes(index)
                      ? v.filter(i => i !== index)
                      : [...v, index]
                    )
                  }}
                  disabled={isPending || !!correction}
                />
                {choice}
              </label>
            </li>
          ))}
        </ul>
        {correction && (
          <div className="mt-2">
            <div
              className={cn(
                'text-base font-bold',
                correction.score === 1 ? 'text-green-700' : 'text-red-500'
              )}
            >
              {correction.score === 1 ? '👏' : '👎'} {correction.score === 1 ? 'Correct' : 'Incorrect'}
            </div>
            {correction.score === 0 && (
              <div className="text-sm">
                The correct answers {correction.feedback.length === 1 ? 'is' : 'are'} the {
                  readableJoin((correction.feedback).map(index => getReadablePosition(index)))} one.
              </div>
            )}
          </div>
        )}
      </div>
      {!correction && answers.length > 0 && <div className="block md:hidden">{checkAnswerButton}</div>}
      
    </div>
  )
}