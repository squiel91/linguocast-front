import { ICompleteEpisode, ICompletePodcast } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Loader } from "@/ui/loader.ui"
import { useQueries } from "@tanstack/react-query"
import axios from "axios"
import { BetweenHorizonalEndIcon, HeadphonesIcon, MessagesSquareIcon, PencilLineIcon, PlusIcon, RefreshCwIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { readableDate } from "@/utils/date.utils"

export const CreatorsListPodcastEpisodes = () => {
  const { podcastId: rawPodcastId } = useParams()
  const podcastId = +(rawPodcastId!)

  const [
    { data: podcast },
    { data: userEpisodes, isPending, isError }
  ] = useQueries({
    queries: [
      {
        queryKey: ['creators', 'podcasts', podcastId],
        queryFn: () => axios.get<ICompletePodcast>(`/api/user/podcasts/${podcastId}`).then(res => res.data)
      },
      {
        queryKey: ['creator', 'episodes', podcastId],
        queryFn: () => axios.get<ICompleteEpisode[]>(`/api/user/podcasts/${podcastId}/episodes`, { params: { size: 10 }}).then(res => res.data)
      }
    ]
  })

  return (
    <>
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <h2 className="text-3xl">Podcast episodes</h2>
        <div className="flex gap-2">
          {podcast?.rss && (
            <Button variant="outline" prepend={<RefreshCwIcon size={20} strokeWidth={2.5} />} >
              RSS sync
            </Button>
          )}
          <Link to={`/creators/podcasts/${podcastId}/episodes/new`}>
            <Button prepend={<PlusIcon size={20} strokeWidth={2.5} />} >New episode</Button>
          </Link>
        </div>
      </div>
      {/* <div className="flex items-center justify-between p-6 bg-orange-200 border-2 border-black rounded-md mb-8">
        <div>
          <h2 className="text-xl">
            + Add a new episode
          </h2>
        </div>
        <ChevronRightIcon />
      </div> */}
      {isPending && (
        <div className="flex justify-center p-16">
          <Loader big />
        </div>
      )}
      {!isPending && isError && (
        <div>
          There was an error fetching your podcast. Please try again. 
        </div>
      )}
      {!isPending && !isError && userEpisodes.length === 0 && (
        <div>
          You don't have any episode yet. Start by creating one! 
        </div>
      )}
      {!isPending && !isError && userEpisodes.length > 0 && (
        <ul className="grid grid-cols-1 gap-16 lg:gap-8">
          {userEpisodes.map(episode => (
            <li>
              <Link to={`/creators/podcasts/${podcastId}/episodes/${episode.id}/overview`} >
                <Card className="p-0 flex flex-col items-center md:flex-row">
                  <div className="relative w-full md:w-[220px] shrink-0 bg-red-500">
                    <img src={episode.image || episode.podcastImage || noImage} className="w-full min-h-full md:aspect-square content-center object-cover" />
                    {!episode.isListed && <div className="rounded-md px-3 py-1 bg-slate-800 text-white text-sm absolute left-2 top-2">
                      Unlisted
                    </div>}
                  </div>
                  <div className="min-w-0 p-4 md:pl-12">
                    <div>{readableDate(episode.publishedAt || episode.createdAt)}</div>
                    <h2 className="text-2xl line-clamp-2">{episode.title}</h2>
                    <div className="flex gap-x-4 flex-wrap">
                      <div className="flex gap-2 items-center my-2">
                        <PencilLineIcon size={16} />
                        {episode.exercisesCount} Exercises
                      </div>
                      <div className="flex gap-2 items-center">
                        <BetweenHorizonalEndIcon size={16} />
                        {episode.embeddedCount} Embeddeds
                      </div>
                      <div className="flex gap-2 items-center">
                        <HeadphonesIcon size={16} />
                        {episode.reproductionsCount} Listeners
                      </div>
                      <div className="flex gap-2 items-center">
                        <MessagesSquareIcon size={16} />
                        {episode.commentsCount} Comments
                      </div>
                    </div>
                    {/* <div className="line-clamp-2 text-slate-400">
                      {episode.description}
                    </div> */}
                    {/* <ul className="flex gap-2 flex-wrap text-sm grow items-end">
                      <li className="flex gap-2 bg-slate-200 rounded-md pl-2 pr-4 py-1">
                        <img src={`/flags/${episode.targetLanguage}.svg`} className="w-4" />
                        {capitalize(episode.targetLanguage)}
                      </li>
                      {episode.levels.map(label => <li className="bg-slate-200 px-3 py-1 rounded-md">{capitalize(label)}</li>)}
                    </ul> */}
                    
                    
                    {/* <div>Is Published: {episode.isListed ? 'Yes' : 'No'}</div>               */}
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}