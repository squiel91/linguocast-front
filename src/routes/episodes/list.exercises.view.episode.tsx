import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "@/ui/loader.ui"
import { ViewExercise } from "./exercises/view.exercises.view.episode"
import { Card } from "@/ui/card.ui"
import { IViewExercise } from "./exercises/types.exercises"
import { Link } from "react-router-dom"
import { CrownIcon } from "lucide-react"
import { Button } from "@/ui/button.ui"

interface Props {
  episodeId?: number
}

export const ListExercises = ({ episodeId }: Props) => {
  const { data: exercises, isPending: isLoadingExercises } = useQuery({
    enabled: !!episodeId,
    queryKey: ['episodes', episodeId, 'exercises'],
    queryFn: () => axios.get<IViewExercise[]>(
      '/api/exercises',
      { params: { episodeId } }
    ).then(res => res.data)
  })

  if (isLoadingExercises) return <Loader />
  if (exercises?.length === 0) return (
    <Card className='p-10'>
      <p className="mb-4">
        This episode does not have exercises yet.
      </p>
      <h1 className="text-4xl mb-4">Request it now with Linguocast Premium</h1>
      <p className="text-lg mb-8">
        With Lingucast Premium you can request the transcription + exercises and it will be ready for you in less than 24 hours.
      </p>
      <Link to="/premium">
        <Button prepend={<CrownIcon size={18} />}>Start Your Free Trial</Button>
      </Link>
    </Card>
  )
  return (
    <Card>
      <ul>
        {exercises!.map(exercise => (
          <li className="p-4 border-b-[1px]">
            <ViewExercise exercise={exercise} />
          </li>
        ))}
      </ul>
    </Card>
  )
}