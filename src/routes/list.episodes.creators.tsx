import { ICompleteEpisode } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Loader } from "@/ui/loader.ui"
import { cn } from "@/utils/styles.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { HeadphonesIcon, MessagesSquareIcon, PlusIcon, RepeatIcon } from "lucide-react"
import { Link } from "react-router-dom"
import noImage from '@/assets/no-image.svg'

export const CreatorsListEpisodes = () => {
  const { data: userEpisodes, isPending, isError } = useQuery({
    queryKey: ['creator-episodes'],
    queryFn: () => axios.get<ICompleteEpisode[]>('/api/user/episodes', { params: { size: 10 }}).then(res => res.data)
  })

  return (
    <div className="container">
      <div className="mt-8 mb-8 flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-4xl">My Episodes</h1>
        <Link to="/creators/episodes/new">
          <Button prepend={<PlusIcon size={20} strokeWidth={2.5} />} >New episode</Button>
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
      {!isPending && !isError && userEpisodes.length === 0 && (
        <div>
          You don't have any episode yet. Start by creating one! 
        </div>
      )}
      {!isPending && !isError && userEpisodes.length > 0 && (
        <ul className="grid grid-cols-1 gap-16 lg:gap-8">
          {userEpisodes.map(episode => (
            <li>
              <Link to={`/creators/episodes/${episode.id}`} >
                <Card className="p-0">
                  <div className={cn('flex flex-col md:flex-row', !episode.isListed ? '' : '')}>
                    <div className="relative w-full md:w-[250px] h-full shrink-0">
                      <img src={episode.image || episode.podcastImage || noImage} className="w-full md:aspect-square content-center object-cover" />
                      {!episode.isListed && <div className="rounded-md px-3 py-1 bg-slate-800 text-white text-sm absolute left-4 top-4">
                        Unlisted
                      </div>}
                    </div>
                    <div className="flex flex-col gap-4 md:gap-2 p-4 md:p-8">
                      <h2 className="text-2xl line-clamp-2">{episode.title}</h2>
                      <h2 className="text-xl line-clamp-1">{episode.podcastName}</h2>
                      <div className="flex gap-x-4 flex-wrap">
                        <div className="flex gap-2 items-center">
                          <RepeatIcon size={16} />
                          {episode.exercisesCount} Exercises
                        </div>
                        <div className="flex gap-2 items-center">
                          <RepeatIcon size={16} />
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
                      <div className="line-clamp-2 text-slate-400">
                        {episode.description}
                      </div>
                      {/* <ul className="flex gap-2 flex-wrap text-sm grow items-end">
                        <li className="flex gap-2 bg-slate-200 rounded-md pl-2 pr-4 py-1">
                          <img src={`/flags/${episode.targetLanguage}.svg`} className="w-4" />
                          {capitalize(episode.targetLanguage)}
                        </li>
                        {episode.levels.map(label => <li className="bg-slate-200 px-3 py-1 rounded-md">{capitalize(label)}</li>)}
                      </ul> */}
                      
                      
                      {/* <div>Is Published: {episode.isListed ? 'Yes' : 'No'}</div>               */}
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