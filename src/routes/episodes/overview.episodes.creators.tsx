import { BarGraph } from "@/components/bar-graph"
import { HeroContent } from "@/components/hero-content"
import { CreatorsEpisodeDto, PoplulatedComment, RawReproduction } from "@/types/types"
import { Card } from "@/ui/card.ui"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BetweenHorizonalEndIcon, ChevronRightIcon, HeadphonesIcon, MessagesSquareIcon, PencilLineIcon, ScanSearch, ScrollIcon, TimerIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Embedded } from "./embeddeds/types.embededs"
import { urlSafe } from "@/utils/url.utils"
import { Avatar } from "@/ui/avatar.ui"
import { formatSeconds, readableDate } from "@/utils/date.utils"
import { IEditExercise } from "./exercises/types.exercises"
import { capitalize } from "@/utils/text.utils"
import { useState } from "react"
import { ViewExerciseResponsesModal } from "./exercises/view-responses-modal.exercises.episodes.creators"
import { calculateAvarage } from "@/utils/numbers.utils"
import { buildReproductionsData } from "@/utils/graph.utils"

export const EpisodeOverview = () => {
  const { episodeId: rawEpisodeId, podcastId } = useParams()
  const episodeId = +(rawEpisodeId!)

  const [checkResponsesExercisesId, setCheckResponsesExercisesId] = useState<IEditExercise | null>(null)

  const { data: episode } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<CreatorsEpisodeDto>(
      `/api/creators/episodes/${episodeId}`
    ).then(res => res.data)
  })

  const { data: embeddeds } = useQuery({
    enabled: !!episodeId,
    queryKey: ['embeddeds', episodeId],
    queryFn: () => axios.get<Embedded[]>(
      '/api/embeddeds',
      { params: { episodeId } }
    ).then(res => res.data)
  })

  const { data: latestComments } = useQuery({
    queryKey: ['episode-comments', episodeId],
    queryFn: () => axios.get<PoplulatedComment[]>('/api/comments', { params: { resourceType: 'episodes', resourceId: episodeId } }).then(res => res.data)
  })

  const { data: exercises } = useQuery({
    queryKey: ['creators', 'episodes', episodeId, 'exercises'],
    queryFn: () => axios.get<IEditExercise[]>(
      '/api/creators/exercises',
      { params: { episodeId } }
    ).then(res => res.data)
  })

  const { data: rawReproductions } = useQuery({
    queryKey: ['episodes', episodeId, 'metrics'],
    queryFn: () => axios.get<RawReproduction[]>(
      `/api/episodes/${episodeId}/metrics`
    ).then(res => res.data)
  })

  return (
    <>
      <h1 className='text-3xl mb-8'>Overview</h1>
      <section className="grid grid-cols-4 gap-8 pb-8">
        {rawReproductions && rawReproductions.length > 0
          ? (
            <div className="col-span-4 flex flex-col h-80">
              <BarGraph data={buildReproductionsData(rawReproductions)} />
              <div className='text-center mt-4'>Past 2-weeks unique listeners</div>
            </div>
          )
          : (
            <div className="col-span-4">There's no enough data to show the listening history yet!</div>
          )
        }
        <HeroContent hero={rawReproductions?.length} description="Total listeners" icon={<HeadphonesIcon />} />
        <HeroContent
          hero={
            rawReproductions && episode ? formatSeconds(calculateAvarage(rawReproductions?.map(r => r.completedAt ? episode?.duration : r.leftOn))) : '--'
          }
          description="Avarage listening time"
          icon={<TimerIcon />}
        />
        <HeroContent hero={latestComments?.length} description="Comments" icon={<MessagesSquareIcon />} />
        <HeroContent hero={embeddeds?.length ?? '--'} description="Embeddeds" icon={<BetweenHorizonalEndIcon />} />
        {!episode?.transcript && (
          <Link to={`/creators/podcasts/${podcastId}/episodes/${episodeId}/transcript`} className="col-span-4 grid grid-cols-[min-content_1fr_min-content] gap-4 border-2 border-slate-200 rounded-md p-8">
            <ScrollIcon />
            <div>
              <h2 className="text-xl">
                You haven't added the transcript yet!
              </h2>
              Add it so listeners can follow along and look-up challenging words.
            </div>
            <ChevronRightIcon className="self-center" />
          </Link>
        )}
        {(embeddeds?.length ?? 0) === 0 && (
          <Link to={`/creators/podcasts/${podcastId}/episodes/${episodeId}/embeddeds`} className="col-span-4 grid grid-cols-[min-content_1fr_min-content] gap-4 border-2 border-slate-200 rounded-md p-8">
            <BetweenHorizonalEndIcon />
            <div>
              <h2 className="text-xl">
                You haven't added any embedded yet!
              </h2>
              Add some to provide extra context to listeners.
            </div>
            <ChevronRightIcon className="self-center" />
          </Link>
        )}
      </section>
      <section className="py-8">
        <div className='text-2xl mb-4'>Latest comments</div>
        {(latestComments?.length ?? 0) > 0
          ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestComments?.map(populatedComment => (
                <Link
                  key={populatedComment.id}
                  to={`/episodes/${episodeId}/${urlSafe(populatedComment.episodeTitle)}`}
                >
                  <Card>
                    {populatedComment.content}
                    <div className="flex gap-3 items-center mt-4">
                      <Avatar avatarUrl={populatedComment.authorAvatar} className="w-10 h-10" />
                      <div className="text-sm">By <Link to={`/users/${populatedComment.authorId}/${urlSafe(populatedComment.authorName)}`} className="font-bold text-primary">{populatedComment.authorName}</Link> on {readableDate(populatedComment.createdAt)}</div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )
          : <p>There are no comments yet!</p>}
      </section>
      <section className="py-8">
        <div className='text-2xl mb-4'>Exercises</div>
        {(exercises?.length ?? 0) > 0
          ? (
            <table className="w-full">
              <tbody>
                <tr>
                  <th>Type</th>
                  <th>Question</th>
                  <th>Responses</th>
                  <th>Correct</th>
                  <th></th>
                </tr>
                {exercises!.map(exercise => (
                  <tr key={exercise.id}>
                    <td>
                      {capitalize(exercise.type.split('-').join(' '))}
                    </td>
                    <td>
                      {exercise.question}
                    </td>
                    <td>
                      {exercise.responsesCount}
                    </td>
                    <td>
                      {!exercise || exercise.responsesCount === 0
                        ? '--'
                        : `${Math.ceil((exercise!.correctCount! / exercise!.responsesCount!) * 100)}%`}
                    </td>
                    <td>
                      <button onClick={() => setCheckResponsesExercisesId(exercise)} className="text-primary">
                        <ScanSearch size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : (
            <Link to={`/creators/podcasts/${podcastId}/episodes/${episodeId}/exercises`} className="grid grid-cols-[min-content_1fr_min-content] gap-4 border-2 border-slate-200 rounded-md p-8">
              <PencilLineIcon />
              <div>
                <h2 className="text-xl">
                  You haven't added any exercise yet!
                </h2>
                Add some to make the listening more engaging and increase the teaching impact.
              </div>
              <ChevronRightIcon className="self-center" />
            </Link>
          )}
      </section>
      <ViewExerciseResponsesModal
        exercise={checkResponsesExercisesId}
        onDismiss={() => setCheckResponsesExercisesId(null)}
      />
    </>
  )
}