import { ICompletePodcast } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Loader } from "@/ui/loader.ui"
import { cn } from "@/utils/styles.utils"
import { capitalize } from "@/utils/text.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { HeadphonesIcon, LibraryIcon, MessageSquareTextIcon, MessagesSquareIcon, PlusIcon, RepeatIcon } from "lucide-react"
import { Link } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { useAuth } from '@/auth/auth.context'
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

export const CreatorsListPodcasts = () => {
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn && navigate) navigate('/creators', { replace: true })
  }, [navigate, isLoggedIn])

  const { data: userPodcasts, isPending, isError } = useQuery({
    queryKey: ['creator-podcasts'],
    queryFn: () => axios.get<ICompletePodcast[]>('/api/user/podcasts').then(res => res.data)
  })

  if (!isLoggedIn) return <></>

  return (
    <div className="container">
      <div className="mt-8 mb-8 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl">My Podcasts</h1>
        <Link to="/creators/podcasts/source">
          <Button prepend={<PlusIcon size={20} strokeWidth={2.5} />} >Add new</Button>
        </Link>
      </div>
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
      {!isPending && !isError && userPodcasts.length === 0 && (
        <div>
          You don't have any podcast yet. Start by creating one! 
        </div>
      )}
      {!isPending && !isError && userPodcasts.length > 0 && (
        <ul className="grid grid-cols-1 gap-16 lg:gap-8">
          {userPodcasts.map(podcast => (
            <li>
              <Link to={`/creators/podcasts/${podcast.id}/overview`} >
                <Card className="p-0">
                  <div className={cn('flex flex-col md:flex-row items-center', !podcast.isListed ? '' : '')}>
                    <div className="relative w-full md:w-[250px] h-full shrink-0">
                      <img src={podcast.image || noImage} className="w-full md:aspect-square content-center object-cover" />
                      {!podcast.isListed && <div className="rounded-md px-3 py-1 bg-slate-800 text-white text-sm absolute left-4 top-4">
                        Unlisted
                      </div>}
                    </div>
                    <div className="flex flex-col gap-4 md:gap-2 p-4 md:p-8">
                      <h2 className="text-2xl line-clamp-2">{podcast.name}</h2>
                      <div className="flex gap-x-4 flex-wrap">
                        <div className="flex gap-2 items-center">
                          <LibraryIcon size={16} />
                          {podcast.episodesCount} Episodes
                        </div>
                        <div className="flex gap-2 items-center">
                          <RepeatIcon size={16} />
                          {podcast.followersCount} Followers
                        </div>
                        <div className="flex gap-2 items-center">
                          <HeadphonesIcon size={16} />
                          {podcast.uniqueReproductions} Listeners
                        </div>
                        <div className="flex gap-2 items-center">
                          <MessageSquareTextIcon size={16} />
                          {podcast.reviewsCount} Reviews
                        </div>
                        <div className="flex gap-2 items-center">
                          <MessagesSquareIcon size={16} />
                          {podcast.commentsCount} Comments
                        </div>
                      </div>
                      {/* <div className="line-clamp-2 text-slate-400">
                        {podcast.description}
                      </div> */}
                      <ul className="flex gap-2 flex-wrap text-sm items-end">
                        <li className="flex gap-2 bg-slate-200 rounded-md pl-2 pr-4 py-1">
                          <img src={`/flags/${podcast.targetLanguage}.svg`} className="w-4" />
                          {capitalize(podcast.targetLanguage)}
                        </li>
                        {podcast.levels.map(label => <li className="bg-slate-200 px-3 py-1 rounded-md">{capitalize(label)}</li>)}
                      </ul>
                      
                      
                      {/* <div>Is Published: {podcast.isListed ? 'Yes' : 'No'}</div>               */}
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}