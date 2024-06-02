import { PopulatedEpisode } from "@/types/types"
import { formatSeconds, readableDate } from "@/utils/date.utils"
import noImage from '@/assets/no-image.svg'
import { CheckIcon, PauseIcon, PlayIcon } from "lucide-react"
import { usePlayer } from "@/themes/player/player"
import axios from "axios"
import { MouseEventHandler, useState } from "react"
import { useAuth } from "@/auth/auth.context"
import { cn } from "@/utils/styles.utils"
import { Link } from "react-router-dom"
import { urlSafe } from "@/utils/url.utils"

interface Props {
  episode: PopulatedEpisode
}

export const EpisodeSummary = ({ episode }: Props) => {
  const { isLoggedIn, openRegisterHandler } = useAuth()

  const [hasMarkedCompleted, setHasMarkedCompleted] = useState<boolean | null>(null)
  const { reproduce, currentEpisode, isPlaying, pause, play } = usePlayer()

  const episodeIsSelected = currentEpisode === episode
  const episodeIsPlaying = episodeIsSelected && isPlaying

  const stateChangeHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (episodeIsPlaying) return pause()
    if (episodeIsSelected) return play()
    reproduce(episode)
  }

  const markCompletedHandler: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isLoggedIn) return openRegisterHandler(true)
    try {
      await axios.post(`/api/episodes/${episode.id}/reproductions`, { hasCompleted: true})
      setHasMarkedCompleted(true)
    } catch (error) {
      setHasMarkedCompleted(false)
      console.error(error)
      alert('There was an error when marking it complete. Please try again.')
    }
  }

  return (
    <li>
      <Link
        to={`/episodes/${episode.id}/${urlSafe(episode.title)}`}
        className="py-6 flex gap-4 border-b-2 border-slate-200"
      >
        <img
          className="w-12 h-12 flex-shrink-0 rounded-md border-2 border-slate-200"
          src={episode.image ?? (episode.belongsTo.coverImage
            ? `/dynamics/podcasts/covers/${episode.belongsTo.coverImage}`
            : noImage)}
        />
        <div className="flex-grow">
          <div className="font-bold break-all">{episode.title}</div>
          <div className="text-sm text-slate-400 line-clamp-2 break-all w-full">{episode.description.replace(/<[^>]+>/ig, '')}</div>
          <div className="flex items-center mt-2 text-sm gap-2 flex-wrap">
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
            {episode.completedAt || hasMarkedCompleted
              ? (
                <>
                  <CheckIcon size={16} /> Episode completed
                </>
              )
              : (
                <button onClick={markCompletedHandler} className="text-primary ml-4">Mark completed</button>    
              )
            }
          </div>
        </div>
        <button
          onClick={stateChangeHandler}
          className={
            cn(
              "p-3 text-white rounded-full self-center",
              episode.completedAt ? 'bg-white border-2 border-primary' : 'bg-primary'
            )
          }
        >
          {
            episode.completedAt
              ? (
                <CheckIcon size={16} strokeWidth={3} className="scale-125 text-primary" />
              )
            : episodeIsPlaying
              ? <PauseIcon size={16} fill="white" />
              : <PlayIcon size={16} fill="white" /> 
          }
        </button>
      </Link>
    </li>
  )
}
