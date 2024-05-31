import { PopulatedEpisode } from "@/types/types"
import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { Loader } from "@/ui/loader.ui"
import { urlSafe } from "@/utils/url.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { formatSeconds, readableDate } from "@/utils/date.utils"

const ViewEpisode = () => {
  const { episodeId: episodeIdRaw } = useParams()
  const episodeId = +episodeIdRaw!
  const {
    data: episode,
    isLoading
  } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<PopulatedEpisode>(`/api/episodes/${episodeId}`).then(res => res.data)
  })

  if (isLoading || !episode) return <Loader />

  return (
    <>
      <Breadcrumb
        current="Google’s AI Gives Weird Answers & Worst Box Office Weekend in 29 Yrs"
        crumbs={[
          {
            name: episode.belongsTo.name,
            to: `/podcasts/${episode.belongsTo.id}/${urlSafe(episode.belongsTo.name)}`
          }
        ]}
      />
      <img
        className="w-80 h-80 rounded-md border-2 border-slate-200"
        src={episode.image ?? (episode.belongsTo.coverImage
          ? `/dynamics/podcasts/covers/${episode.belongsTo.coverImage}`
          : noImage)}
        />
      <h1 className="text-4xl mb-4 font-bold">{episode.title}</h1>
      <div className="mt-8">
        {episode?.description.split('\n').filter(text => text).map((text, index) => (
          <p key={index} className='mb-4 break-words'>{text}</p>
        ))}
      </div>

        <div>
        <div className="flex items-center mt-2 text-sm gap-2">
          <span>{readableDate(episode.publishedAt)}</span>
          <div className="w-1 h-1 rounded-full bg-black"/>
          {episode.leftOn && (episode.leftOn > 0)
            ? (
              <>
                <div className="bg-slate-200 w-20 h-1 rounded-full">
                  <div
                    className="h-full w-0 bg-primary rounded-full"
                    style={{ width: `${(episode.leftOn / episode.duration) * 100}%` }}
                  />
                </div>
                <span>{formatSeconds(episode.duration - episode.leftOn)} left</span>
              </>
            )
            : <span>{formatSeconds(episode.duration)}</span>
          }
        </div>
        
      </div>
    </>
  )
}

export default ViewEpisode
