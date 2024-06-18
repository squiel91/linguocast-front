import { useAuth } from "@/auth/auth.context"
import { Loader } from "@/ui/loader.ui"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { BookmarkIcon, CompassIcon, CrownIcon, TelescopeIcon } from "lucide-react"
import { Button } from "@/ui/button.ui"
import { Carousel } from "./carousel.feed"
import { Episode, MicroPodcast, PoplulatedComment } from "@/types/types"
import { EpisodeSummary } from "@/ui/episode-summary.ui"
import { PodcastSummary } from "@/ui/podcast-summary.ui"
import { urlSafe } from "@/utils/url.utils"
import { Avatar } from "@/ui/avatar.ui"
import { readableDate } from "@/utils/date.utils"
import { Card } from "@/ui/card.ui"
import { usePageTitle } from "@/utils/document.utils"

const Feed = () => {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()

  usePageTitle('Feed')

  if (!isLoggedIn) navigate('/', { replace: true })

  const { data: feedData } = useQuery({
    queryKey: ['feed'],
    queryFn: () => axios.get<{
      newEpisodes: Episode[]
      subscribedPodcasts: MicroPodcast[],
      listeningEpisodes: Episode[]
      latestEpisodeComments: PoplulatedComment[]
      recommendedPodcasts: MicroPodcast[]
    }>('/api/user/feed').then(res => res.data)
  })
  
  if (!feedData) return <Loader />

  const {
    newEpisodes,
    subscribedPodcasts,
    listeningEpisodes,
    latestEpisodeComments,
    recommendedPodcasts
  } = feedData

  return (
    <>
      <h1 className="text-3xl font-bold my-8">
        Welcome back {user?.name}!
      </h1>
      <div className="flex gap-2 flex-wrap">
        <Button prepend={<BookmarkIcon size={16} />}>
          <Link to="/vocabulary-corner">
            Vocabulary Corner
          </Link>
        </Button>
        <Button prepend={<CompassIcon size={16} />}>
          <Link to="/journey">
            Learning Journey
          </Link>
        </Button>
        <Button prepend={<TelescopeIcon size={16} />}>
          <Link to="/explore">
            Explore shows
          </Link>
        </Button>
      </div>
      {newEpisodes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Up next</h2>
          <Carousel
            items={newEpisodes.map(episode => ({
              key: episode.id,
              content: <EpisodeSummary episode={episode} />
            }))}
          />
        </section>
      )}
      {listeningEpisodes.length > 0 && (
        <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">Continue listening</h2>
        <Carousel
          items={listeningEpisodes!.map(episode => ({
            key: episode.id,
            content: <EpisodeSummary episode={episode} />
          }))}
        />
      </section>
      )}
      {subscribedPodcasts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Subscribed podcasts</h2>
            <Carousel
              items={subscribedPodcasts!.map(podcast => ({
                key: podcast.id,
                content: <PodcastSummary podcast={podcast} />
              }))}
            />
        </section>
      )}
      {latestEpisodeComments.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Latest comments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {latestEpisodeComments.map(populatedComment => (
              <Link
                key={populatedComment.id}
                to={`/episodes/${populatedComment.episodeId}/${urlSafe(populatedComment.podcastName)}`}
              >
                <Card>
                <div className="flex gap-4 mb-4">
                   
                   <div className="font-bold line-clamp-2">
                     {populatedComment.episodeTitle}
                   </div>
                 </div>
                  {populatedComment.content}
                  <div className="flex gap-3 items-center mt-4">
                    <Avatar avatarUrl={populatedComment.authorAvatar} className="w-10 h-10" />
                    <div className="text-sm">By <Link to={`/users/${populatedComment.authorId}/${urlSafe(populatedComment.authorName)}`} className="font-bold text-primary">{populatedComment.authorName}</Link> on {readableDate(populatedComment.createdAt)}</div>
                  </div>

                </Card>
                
              </Link>
            ))}
          </div>
          
        </section>
      )}
      {recommendedPodcasts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Recommended podcasts</h2>
          <Carousel
            items={recommendedPodcasts.map(podcast => ({
              key: podcast.id,
              content: <PodcastSummary podcast={podcast} />   
            }))}
          />
        </section>
      )}
      <Button className="mt-8" prepend={<CrownIcon size={16} />}>
        <Link to="/premium">
          Try Premium!
        </Link>
      </Button>
    </>
  )
}

export default Feed
