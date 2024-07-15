import { BarGraph } from "@/components/bar-graph"
import { HeroContent } from "@/components/hero-content"
import { ICompletePodcast, ICreatorsComment } from "@/types/types"
import { buildReproductionsData } from "@/utils/graph.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { ChevronRightIcon, LibraryIcon, MessageSquareTextIcon, RepeatIcon, ScrollIcon } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { RawEpisodeReproduction } from "./podcasts.dtos"
import noImage from '@/assets/no-image.svg'
import { urlSafe } from "@/utils/url.utils"
import { Avatar } from "@/ui/avatar.ui"
import { readableDate } from "@/utils/date.utils"
import { Card } from "@/ui/card.ui"

export const PodcastOverview = () => {
  const { podcastId: rawPodcastId } = useParams()
  const podcastId = +(rawPodcastId!)

  const { data: podcast } = useQuery({
    queryKey: ['creators', 'podcasts', podcastId],
    queryFn: () => axios.get<ICompletePodcast>(`/api/user/podcasts/${podcastId}`).then(res => res.data)
  })

  const { data: latestComments } = useQuery({
    queryKey: ['creators', 'podcasts', podcastId,  'comments'],
    queryFn: () => axios.get<ICreatorsComment[]>('/api/creators/comments', { params: { podcastId } }).then(res => res.data)
  })

  const { data: rawReproductions } = useQuery({
    queryKey: ['creators', 'podcasts', podcastId, 'metrics'],
    queryFn: () => axios.get<RawEpisodeReproduction>(
      `/api/creators/podcasts/${podcastId}/metrics`
    ).then(res => res.data)
  })

  return (
    <>
      <h1 className='text-3xl mb-8'>Overview</h1>
      <section className="grid grid-cols-4 gap-8 pb-8">
        {rawReproductions && rawReproductions.reproductions.length > 0
          ? (
            <div className="col-span-4 flex flex-col h-80">
              <BarGraph data={buildReproductionsData(rawReproductions.reproductions)} />
              <div className='text-center mt-4'>Past 2-weeks unique listeners</div>
            </div>
          )
          : (
            <div className="col-span-4">There's no enough data to show the listening history yet!</div>
          )
        }
        <HeroContent hero={podcast?.followersCount} description="Followers" icon={<RepeatIcon />} />
        <HeroContent hero={podcast?.episodesCount} description="Episodes" icon={<LibraryIcon />} />
        <HeroContent hero={podcast?.reviewsCount} description="Reviews" icon={<MessageSquareTextIcon />} />
        <HeroContent hero={podcast?.uniqueReproductions} description="Total reproductions" icon={<MessageSquareTextIcon />} />
        {podcast?.episodesCount === 0 && (
          <Link to={`/creators/podcasts/${podcastId}/episodes`} className="col-span-4 grid grid-cols-[min-content_1fr_min-content] gap-4 border-2 border-slate-200 rounded-md p-8">
            <ScrollIcon />
            <div>
              <h2 className="text-xl">
                You haven't added any episode yet!
              </h2>
              Add some episode to publish your podcast.
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
              {latestComments?.map(comment => (
                <Link
                  key={comment.id}
                  to={`/episodes/${comment.episode.id}/${urlSafe(comment.episode.title)}`}
                >
                  <Card>
                    {comment.content}
                    <div className="flex gap-3 items-center mt-4">
                      <Avatar avatarUrl={comment.author.avatar} className="w-10 h-10" />
                      <div className="text-sm">By <Link to={`/users/${comment.author.id}/${urlSafe(comment.author.name)}`} className="font-bold text-primary">{comment.author.name}</Link> on {readableDate(comment.createdAt)}</div>
                    </div>
                    <div className="mt-4 text-sm line-clamp-1">{comment.episode.title}</div>
                  </Card>
                </Link>
              ))}
            </div>
          )
          : <p>There are no comments yet!</p>}
        </section>
        <section>
          <div className='text-2xl mb-4'>Most popular episodes</div>
          {(rawReproductions?.episodes.length ?? 0) > 0
          ? (
            <table className="w-full">
              <tbody>
                <tr>
                  <th>Episode</th>
                  <th>Total listeners</th>
                </tr>
                {rawReproductions?.episodes.map(e => ({
                    ...e,
                    reproductions: rawReproductions.reproductions.filter(r => r.episodeId === e.id).length
                  }))!.map(episode => (
                  <tr key={episode.id}>
                    <td>
                      <Link className="text-primary flex gap-4 items-center" to={`/creators/podcasts/${podcastId}/episodes/${episode.id}/overview`}>
                        <img src={episode.image || podcast?.image || noImage} className="w-12 aspect-square rounded-md" />
                        {episode.title}
                      </Link>
                    </td>
                    <td>
                      {episode.reproductions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          : 'You don\'t have any episode with reproductions yet.'}
        </section>
    </>
  )
}
