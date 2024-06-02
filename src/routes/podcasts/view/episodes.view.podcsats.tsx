import { PopulatedEpisode } from "@/types/types"
import { EpisodeSummary } from "./summery.episodes.view.podcasts"
import { Button } from "@/ui/button.ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"

interface Props {
  podcastId: number
  totalEpisodes: number
}

export const ListEpisodes = ({ podcastId, totalEpisodes }: Props) => {
  const {
    data: fetchedPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['episodes'],
    queryFn: ({ pageParam }: { pageParam?: number | null }) => axios.get<PopulatedEpisode[]>(
      `/api/podcasts/${podcastId}/episodes`, { params: { size: 5, from: pageParam ?? undefined }}
    ).then(res => {
      return {
        data:  res.data,
        // currentPage: null,
        nextPage: res.data.at(-1)?.id
      }
    }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => (pages.map(page => page.data).flat() ?? []).length < totalEpisodes ? lastPage.nextPage : null
  })

  
  return (
    <div>
      <div className="pb-2 border-b-2 mt-8 text-slate-400">
        Episodes ({totalEpisodes})
      </div>
      <ul>
        {totalEpisodes === 0
          ? <li className="mt-4">Add an RSS Feed to show the episodes</li>
          : (fetchedPages?.pages.map(page => page.data).flat() ?? []).map(episode => (
            <EpisodeSummary key={episode.id} episode={episode} />
          ))
        }
      </ul>
      {hasNextPage && (
        <Button variant="outline" className="mt-4" onClick={fetchNextPage} isLoading={isFetchingNextPage}>Load more</Button>
      )}
      
    </div>
  )
}