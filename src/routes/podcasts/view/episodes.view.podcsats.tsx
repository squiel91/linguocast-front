import { MinifiedEpisode } from "@/types/types"
import { EpisodeSummary } from "./summery.episodes.view.podcasts"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "@/ui/loader.ui"
import { useInView } from 'react-intersection-observer'
import { useEffect } from "react"

interface Props {
  podcastId: number
  totalEpisodes: number
}

export const ListEpisodes = ({ podcastId, totalEpisodes }: Props) => {
  const {
    data: fetchedPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['podcasts', podcastId, 'episodes'],
    queryFn: ({ pageParam }: { pageParam?: number | null }) => axios.get<MinifiedEpisode[]>(
      `/api/podcasts/${podcastId}/episodes`, { params: { size: 5, from: pageParam ?? undefined }}
    ).then(res => {
      return {
        data:  res.data, // TODO: just need to resturn res.data
        // currentPage: null,
        nextPage: res.data.at(-1)?.id
      }
    }),
    initialPageParam: null,
    getNextPageParam: (lastPage, pages) => (pages.map(page => page.data).flat() ?? []).length < totalEpisodes ? lastPage.nextPage : null
  })

  const { ref: loadMoreElem, inView: loadMoreInView } = useInView()
  
  useEffect(() => {
    if (!isFetchingNextPage && loadMoreInView) {
      fetchNextPage()
    }
  }, [fetchNextPage, isFetchingNextPage, loadMoreInView])

  return (
    <>
      <ul className="flex flex-col gap-4 mt-4">
        {totalEpisodes === 0
          ? <li className="mt-4">The podcast does not have any episodes.</li>
          : (fetchedPages?.pages.map(page => page.data).flat() ?? []).map(episode => (
            <EpisodeSummary key={episode.id} episode={episode} />
          ))
        }
      </ul>
      {hasNextPage && (
        <div ref={loadMoreElem} className="flex justify-center py-2">
          <Loader />
        </div>
      )}
      {/* <Button variant="outline" className="mt-4" onClick={fetchNextPage} isLoading={isFetchingNextPage}>Load more</Button> */}      
    </>
  )
}