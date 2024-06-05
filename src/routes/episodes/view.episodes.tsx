import { PopulatedEpisode } from "@/types/types"
import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { Loader } from "@/ui/loader.ui"
import { urlSafe } from "@/utils/url.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { formatSeconds, readableDate } from "@/utils/date.utils"
import { MouseEventHandler, useState } from "react"
import { TabHeader } from "@/ui/tab-header.ui"
import { PlayButton } from "@/ui/play-button.ui"
import { usePlayer } from "@/themes/player/player"
import { ListeningProgressBar } from "@/ui/listening-progress-bar.ui"

const ViewEpisode = () => {
  const { episodeId: episodeIdRaw } = useParams()

  const { reproduce, currentEpisode, isPlaying, pause, play } = usePlayer()

  const episodeId = +episodeIdRaw!
  const {
    data: episode,
    isLoading
  } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<PopulatedEpisode>(`/api/episodes/${episodeId}`).then(res => res.data)
  })

  const [selectedTabKey, setSelectedTabKey] = useState('episodes')
  if (isLoading || !episode) return <Loader />

  const episodeIsSelected = currentEpisode === episode
  const episodeIsPlaying = episodeIsSelected && isPlaying

  const stateChangeHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (episodeIsPlaying) return pause()
    if (episodeIsSelected) return play()
    reproduce(episode)
  }

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4">
        <img
          className="'w-full border-[1px] drop-shadow-sm border-solid border-slate-200 rounded-md mb-4 aspect-square bg-cover"
          src={episode.image ?? (episode.belongsTo.coverImage
            ? `/dynamics/podcasts/covers/${episode.belongsTo.coverImage}`
            : noImage)}
        />
        <div className='col-span-1 lg:col-span-2'>
          <h1 className="text-4xl mb-4 font-bold">{episode.title}</h1>
          <div className="flex items-center mt-2 text-sm gap-2">
            <PlayButton
              isPlaying={isPlaying}
              isLoading={isLoading}
              onTogglePlay={stateChangeHandler}
            />
            <span>{readableDate(episode.publishedAt)}</span>
            <div className="w-1 h-1 rounded-full bg-black"/>
              {episode.leftOn && (episode.leftOn > 0)
                ? <ListeningProgressBar duration={episode.duration} leftOn={episode.leftOn} />
                : <span>{formatSeconds(episode.duration)}</span>
              }
            </div>
            <div className="mt-8">
            {episode?.description.split('\n').filter(text => text).map((text, index) => (
              <p key={index} className='mb-4 break-words'>{text}</p>
            ))}
          </div>
          <TabHeader
            selectedKey={selectedTabKey}
            options={[
              { title: 'Transcript', key:'episodes' },
              { title: 'Exercises', key:'exercises' },
              { title: 'Comments', key:'comments' }
            ]}
            onChange={(key) => setSelectedTabKey(key)}
          />
        </div>
      </div>
    </>
  )
}

export default ViewEpisode
