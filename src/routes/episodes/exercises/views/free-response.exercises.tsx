import { Button } from "@/ui/button.ui"
import { IViewFreeResponseExercise } from "../types.exercises"
import { cn } from "@/utils/styles.utils"
import { useState, useEffect } from "react"
import { ArrowRightIcon } from "lucide-react"
import { Textarea } from "@/ui/textarea.ui"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface Props {
  exercise: IViewFreeResponseExercise
}

export const ViewFreeResponseExercise = ({ exercise }: Props) => {
  const [answer, setAnswer] = useState<string | null>(null)
  const [correction, setCorrection] = useState<{ score: number, feedback: string } | null>(null)

  useEffect(() => {
    
    if (!exercise.response) return
    setAnswer(exercise.response)
    setCorrection({ score: exercise.score!, feedback: exercise.feedback! })
  }, [exercise])

  const { mutate: recordResponse, isPending } = useMutation({
    mutationKey: ['record-exercise-response', exercise.id ?? null],
    mutationFn: () => axios.post<{ score: number, feedback: string }>(
      `/api/exercises/${exercise.id}/responses`, { type: 'free-response', response: answer}
    ).then(res => res.data),
    onSuccess: (correction) => setCorrection(correction),
    onError: (error) => {
      console.error(error)
      alert('There was an error saving your response. Please try again.')
    }
  })

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
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
      <div className="flex flex-col justify-between">
        <div>
          <p className="mb-1">{exercise.question}</p>
          <div className="text-sm text-slate-400 mb-2 flex gap-2 items-center">Write you answer {<ArrowRightIcon className="hidden md:block" size={16} />}</div>
        </div>
        {!correction && answer && <div className="hidden md:block">{checkAnswerButton}</div>}
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          value={answer}
          onChange={setAnswer}
          minRows={2}
          disabled={isPending || !!correction}
        />
        {!correction && answer && <div className="block md:hidden">{checkAnswerButton}</div>}
        {correction && (
          <div>
            <div
              className={cn(
                'text-base font-bold',
                correction?.score === 1 ? 'text-green-700' : 'text-red-500'
              )}
            >
              {correction.score === 1 ? '👏' : '👎'} {correction?.score === 1 ? 'Correct' : 'Can be improved'}
            </div>
            <div className="text-sm">
              {correction?.feedback}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}