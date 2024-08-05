import { ICompleteEpisode, ICompletePodcast } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Loader } from "@/ui/loader.ui"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BetweenHorizonalEndIcon, HeadphonesIcon, MessagesSquareIcon, PencilLineIcon, PlusIcon, RefreshCwIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { readableDate } from "@/utils/date.utils"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

const PAGE_SIZE = 5 // ATTENTION: this value needs to be in sync with the backend page size.

export const CreatorsListPodcastEpisodes = () => {
  const { podcastId: rawPodcastId } = useParams()
  const podcastId = +(rawPodcastId!)

  const { ref: loadMoreElem, inView: loadMoreInView } = useInView()
 
  const { data: podcast } = useQuery({
    queryKey: ['creators', 'podcasts', podcastId],
    queryFn: () => axios.get<ICompletePodcast>(
      `/api/creators/podcasts/${podcastId}`
    ).then(res => res.data)
  })

  const {
    data: episodesPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['creator', 'episodes', podcastId],
    queryFn: ({ pageParam: lastEpisodeId }: { pageParam: number | null }) => axios.get<ICompleteEpisode[]>(
      `/api/creators/podcasts/${podcastId}/episodes`,
      { params: { size: PAGE_SIZE, ...(lastEpisodeId ? { from: lastEpisodeId } : {})} }
    ).then(res => res.data),
    initialPageParam: null,
    getNextPageParam: lastEpisodesPage => lastEpisodesPage.length < PAGE_SIZE ? null : lastEpisodesPage.at(-1)!.id
  })

  useEffect(() => {
    if (!isFetchingNextPage && loadMoreInView) {
      fetchNextPage()
    }
  }, [fetchNextPage, isFetchingNextPage, loadMoreInView])

  const episodes = episodesPages?.pages.flat() ?? []

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
      {episodes.length === 0 && isFetchingNextPage && <li className="mt-4">The podcast does not have any episodes yet.</li>}
      {episodes.length > 0 && (
        <ul className="flex flex-col gap-4 mt-4">
          {episodes.map(episode => (
            <li key={episode.id}>
              <Link to={`/creators/podcasts/${podcastId}/episodes/${episode.id}/overview`} >
                <Card className="p-0 flex flex-col items-center md:flex-row">
                  <div className="relative w-full md:w-[220px] shrink-0 bg-slate-300">
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
      {hasNextPage && (
        <div ref={loadMoreElem} className="flex justify-center py-8">
          <Loader big />
        </div>
      )}
   
    </>
  )
}