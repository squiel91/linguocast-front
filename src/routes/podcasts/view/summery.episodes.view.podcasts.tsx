import { PopulatedEpisode } from "@/types/types"
import { formatSeconds, readableDate } from "@/utils/date.utils"
import noImage from '@/assets/no-image.svg'
import { DotIcon, PauseIcon, PlayIcon } from "lucide-react"
import { usePlayer } from "@/themes/player/player"

interface Props {
  episode: PopulatedEpisode
}

export const EpisodeSummary = ({ episode }: Props) => {
  const { reproduce, currentEpisode, isPlaying, pause, play } = usePlayer()

  const episodeIsSelected = currentEpisode === episode
  const episodeIsPlaying = episodeIsSelected && isPlaying

  const stateChangeHandler = () => {
    if (episodeIsPlaying) return pause()
    if (episodeIsSelected) return play()
    reproduce(episode)
  }

  return (
    <li className="py-6 flex gap-6 border-b-2 border-slate-200">
      <img
        className="w-12 h-12 rounded-md border-2 border-slate-200"
        src={episode.image ?? (episode.belongsTo.coverImage
          ? `/dynamics/podcasts/covers/${episode.belongsTo.coverImage}`
          : noImage)}
      />
      <div>
        <div className="font-bold break-all">{episode.title}</div>
        <div className="text-sm text-slate-400 line-clamp-2 break-all w-full">{episode.description.replace(/<[^>]+>/ig, '')}</div>
        <div className="flex items-center mt-2 text-sm">
          {readableDate(episode.publishedAt)} <DotIcon /> {formatSeconds(episode.duration)}
        </div>
      </div>
      <button onClick={stateChangeHandler} className="p-3 bg-primary text-white rounded-full self-center">
        {episodeIsPlaying
          ? <PauseIcon size={16} fill="white" />
          : <PlayIcon size={16} fill="white" />}
      </button>
    </li>
  )
}
