import Dialog from "@/ui/dialog.ui"
import { ExerciseResponse, IEditExercise } from "./types.exercises"
import { capitalize } from "@/utils/text.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { CheckIcon, UsersIcon, XIcon } from "lucide-react"
import { readableDate } from "@/utils/date.utils"
import { Card } from "@/ui/card.ui"
import { Avatar } from "@/ui/avatar.ui"
import { urlSafe } from "@/utils/url.utils"
import { Link } from "react-router-dom"
import { cn } from "@/utils/styles.utils"
import { HeroContent } from "@/components/hero-content"

interface Props {
  exercise: IEditExercise | null
  onDismiss: () => void
}

export const ViewExerciseResponsesModal = ({ exercise , onDismiss: dismissHandler }: Props) => {
  const { data: responses } = useQuery({
    enabled: !!exercise,
    queryKey: ['exercise-responses', exercise?.id ?? null],
    queryFn: () => axios.get<ExerciseResponse[]>(`/api/creators/exercises/${exercise!.id}/responses`).then(res => res.data)
  })

  let correctChoices: string[] = []
  if (exercise?.type === 'multiple-choice' || exercise?.type === 'select-multiple') {
    correctChoices = exercise.type === 'multiple-choice'
      ? [exercise.correctChoice]
      : exercise.correctChoices
  }
  return (
    <Dialog isOpen={!!exercise} onClose={dismissHandler} className="w-[600px]">
      <div className="font-bold">{capitalize(exercise?.type.split('-').join(' ') ?? '')}</div>
      <div className="grid grid-cols-2 gap-4 my-6">
        <HeroContent hero={responses?.length ?? '--'} description="Total" icon={<UsersIcon />} />
        <HeroContent hero={responses?.filter(({ score }) => score > 0).length ?? '--'} description="Correct" icon={<CheckIcon />} />
      </div>
      <div className="flex flex-col gap-2">
        <div>  
          <div className="text-sm text-slate-600">
            Question
          </div>
          <div className="text-lg">
            {exercise?.question}
          </div>
        </div>
        {exercise?.type === 'free-response' && (
          <>
            <div>
              <div className="text-sm text-slate-600">
                Response model
              </div>
              <div className="text-lg">
                {exercise?.response}
              </div>
            </div>
            <div className="text-sm text-slate-600">
              Learners responses ({exercise?.responsesCount})
            </div>
            <ul className="flex flex-col gap-4">
              {responses?.map((response, index) => (
                <li key={index}>
                  <Card>
                    <div className={cn('flex gap-2 items-center mb-2', response.score === 1 ? 'text-green-600' : 'text-red-500')}>
                      {response.score === 1 ? <CheckIcon size={16} /> : <XIcon size={16} />}
                      Marked as {response.score === 1 ? 'correct' : 'incorrect'}
                    </div>
                    <div className="text-lg">
                      {response.response}
                    </div>
                    <div className="text-sm text-slate-400">
                      {response.feedback}
                    </div>
                    <div className="flex gap-4 items-center mt-4">
                      <Avatar avatarUrl={response.userAvatar} />
                      <div>
                        By <Link target="_blank" className="font-bold text-primary" to={`/users/${response.userId}/${urlSafe(response.userName)}`}>{response.userName}</Link> on {readableDate(response.createdAt)}
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </>

        )}
        {(exercise?.type === 'multiple-choice' || exercise?.type === 'select-multiple')  && (
          <div className="grid grid-cols-[max-content_1fr_1fr] gap-2 text-lg">
              <div className="text-sm text-slate-600 font-medium text-left col-span-2">Choices</div>
              <div className="text-sm text-slate-600 font-medium text-left">Responses ({responses?.length})</div>
              {correctChoices.map((correctChoice, index) => (
                <>
                  <div>
                    <CheckIcon className="text-green-600" />
                  </div>
                  <div>
                    {correctChoice}
                  </div>
                  <ul className="flex items-center gap-2"> 
                    {responses?.filter(response => exercise.type === 'multiple-choice' ? (response.response as number) === index : (response.response as number[])?.includes(index)).map((response, index) => (
                        <li key={index}>
                          <Link to={`/users/${response.userId}/${urlSafe(response.userName)}`} target="_blank" title={response.userName}>
                            <Avatar avatarUrl={response.userAvatar} />
                          </Link>
                        </li>
                      ))
                    }
                  </ul>
                </>
              ))}
              {exercise.incorrectChoices.map((incorrectChoice, index) => (
                <>
                  <div>
                    <XIcon className="text-red-500" />
                  </div>
                  <div>
                    {incorrectChoice}
                  </div>
                  <ul className="flex items-center gap-2"> 
                    {responses?.filter(response => exercise.type === 'multiple-choice' ? (response.response as number) === index + correctChoices.length : (response.response as number[]).includes(index + correctChoices.length)).map((response, index) => (
                        <li key={index}>
                          <Link to={`/users/${response.userId}/${urlSafe(response.userName)}`} target="_blank" title={response.userName}>
                            <Avatar avatarUrl={response.userAvatar} />
                          </Link>
                        </li>
                      ))}
                  </ul>
                </>
              ))}
          </div>
        )}
      </div>
    </Dialog>
  )

}