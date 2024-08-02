import { MinifiedEpisode } from "@/types/types"
import { formatSeconds, readableDate } from "@/utils/date.utils"
import noImage from '@/assets/no-image.svg'
import { BookOpenCheckIcon, CheckIcon, EllipsisVertical, ScrollIcon } from "lucide-react"
// import { usePlayer } from "@/themes/player/player"
import axios from "axios"
import { useState } from "react"
import { useAuth } from "@/auth/auth.context"
import { Link } from "react-router-dom"
import { urlSafe } from "@/utils/url.utils"
import { Card } from "@/ui/card.ui"
import { Dropdown } from "@/ui/dropdown.ui"

interface Props {
  episode: MinifiedEpisode
}

export const EpisodeSummary = ({ episode }: Props) => {
  const { isLoggedIn, openRegisterHandler } = useAuth()

  const [hasMarkedCompleted, setHasMarkedCompleted] = useState<boolean | null>(null)
  // const { reproduce, currentEpisode, isPlaying, pause, play } = usePlayer()

  // const episodeIsSelected = currentEpisode === episode
  // const episodeIsPlaying = episodeIsSelected && isPlaying

  // const stateChangeHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
  //   event.preventDefault()
  //   event.stopPropagation()
  //   if (episodeIsPlaying) return pause()
  //   if (episodeIsSelected) return play()
  //   reproduce(episode)
  // }

  const markCompletedHandler = async () => {
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
      >
        <Card
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex md:block justify-between flex-shrink-0 items-center">
            <img
              className="w-14 h-14 rounded-md border-2 border-slate-200"
              src={episode.image || episode.podcastImage || noImage}
            />
            <Dropdown
              className="md:hidden"
              unformated
              items={[
                {
                  title: 'Mark studied',
                  onClick: markCompletedHandler,
                  target: '_blank',
                  icon: <BookOpenCheckIcon size={18} />,
                  unformated: true
                }
              ]}
            >
              <EllipsisVertical size={18} />
            </Dropdown>
          </div>
          <div className="flex-grow flex flex-col break-words overflow-hidden">
            <div className="font-bold line-clamp-2">{episode.title}</div>
            <div className="text-sm text-slate-400 line-clamp-2 mb-1">{episode.truncatedDescription.replace(/<[^>]+>/ig, '')}</div>
            {episode.hasTranscript && (
              <div className="bg-slate-200 rounded-full text-slate-900 my-1 px-2 text-sm flex gap-2 items-center self-start">
                <ScrollIcon size={12} />
                With transcript
              </div>
            )}
            <div className="flex items-center mt-1 text-sm gap-2 flex-wrap">
              <span>{readableDate(episode.publishedAt)}</span>
              {episode.completedAt || hasMarkedCompleted
                ? (
                  <>
                    <CheckIcon size={16} /> Studied
                  </>
                )
                : (
                  <>
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
                    <div className="hidden md:block w-1 h-1 rounded-full bg-black"/>
                    <button
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        markCompletedHandler()
                      }}
                      className="hidden md:block text-primary"
                    >
                      Mark studied
                    </button>    
                  </>
                )
              }
            </div>
          </div>
        </Card>
      </Link>
    </li>
  )
}
