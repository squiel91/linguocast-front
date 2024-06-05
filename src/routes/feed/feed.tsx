import { useAuth } from "@/auth/auth.context"
import { Loader } from "@/ui/loader.ui"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { CompassIcon, CrownIcon, TelescopeIcon } from "lucide-react"
import { Button } from "@/ui/button.ui"
import { Carousel } from "./carousel.feed"
import { Episode, MicroPodcast } from "@/types/types"
import { EpisodeSummary } from "@/ui/episode-summary.ui"
import { PodcastSummary } from "@/ui/podcast-summary.ui"

const Feed = () => {
  const { isLoggedIn, user } = useAuth()
  const navigate = useNavigate()

  if (!isLoggedIn) navigate('/', { replace: true })

  const { data: feedData } = useQuery({
    queryKey: ['feed'],
    queryFn: () => axios.get<{
      newEpisodes: Episode[]
      subscribedPodcasts: MicroPodcast[],
      listeningEpisodes: Episode[]
      recommendedPodcasts: MicroPodcast[]
    }>('/api/user/feed').then(res => res.data)
  })
  
  if (!feedData) return <Loader />

  const {
    newEpisodes,
    subscribedPodcasts,
    listeningEpisodes,
    recommendedPodcasts
  } = feedData

  return (
    <>
      <h1 className="text-3xl font-bold my-8">
        Welcome back {user?.name}!
      </h1>
      <div className="flex gap-2">
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
          <h2 className="text-2xl font-bold my-8">Up next</h2>
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
      
      {/* <section>
        <h2 className="text-2xl font-bold mt-8 mb-4">Latest comments</h2>
      </section> */}
      {recommendedPodcasts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mt-8 mb-4">Recommended podcasts</h2>
          <Carousel
            items={recommendedPodcasts!.map(podcast => ({
              key: podcast.id,
              content: <PodcastSummary podcast={podcast} />   
            }))}
          />
        </section>
      )}
      <Button prepend={<CrownIcon size={16} />}>
        <Link to="/premium">
          Try Premium!
        </Link>
      </Button>
    </>
  )
}

export default Feed
