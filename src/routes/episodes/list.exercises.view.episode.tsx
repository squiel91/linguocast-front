import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "@/ui/loader.ui"
import { ViewExercise } from "./exercises/view.exercises.view.episode"
import { Card } from "@/ui/card.ui"
import { IViewExercise } from "./exercises/types.exercises"

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
  return (
    <Card className="p-0">
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