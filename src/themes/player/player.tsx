import { PopulatedEpisode } from "@/types/types";
import { PauseIcon, PlayIcon, RotateCcwIcon, RotateCwIcon, SquareIcon } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import noImage from '@/assets/no-image.svg'
import { formatSeconds } from "@/utils/date.utils";

interface Player {
  currentEpisode: PopulatedEpisode | null
  isPlaying: boolean
  reproduce: (episode: PopulatedEpisode) => void
  play: () => void
  pause: () => void
}

export const AuthContext = createContext<Player>({
  currentEpisode: null,
  isPlaying: false,
  reproduce: () => console.log('reproduce'),
  play: () => console.log('pause'),
  pause: () => console.log('pause')

})

export const PlayerContextWrapper = () => {
  const [currentEpisode, setCurrentEpisode] = useState<PopulatedEpisode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioElem = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioElem.current
    if (!audio) return
    if (isPlaying) audio.play()
    else audio.pause()
  }, [isPlaying])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const audio = audioElem.current
      if (!audio || !audio.duration) return
      setCurrentTime(audio.currentTime)
    }, 200)
    return () => clearInterval(intervalId)
  }, []) // TODO optimize it to only run when it is playing

  const changeTime = (newTime: number) => {
    setCurrentTime(newTime)
    if (!audioElem.current) return
    audioElem.current.currentTime = newTime
  }
  return (
    <AuthContext.Provider
      value={{
        currentEpisode: currentEpisode,
        isPlaying: isPlaying,
        reproduce: (episode) => {
          setCurrentEpisode(episode)
          setIsPlaying(true)
        },
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false)
      }}
    >
      <Outlet />
      {currentEpisode && (
        <div className="fixed left-0 bottom-0 right-0 rounded-md">
          <div className="container flex flex-col pb-4 bg-primary p-4 rounded-tr-lg rounded-tl-lg text-white">
            <div className="flex justify-between gap-8">
              <div className="flex gap-4">
                <img
                  className="w-12 h-12 rounded-md border-2 border-slate-200"
                  src={currentEpisode.image ?? (currentEpisode.belongsTo.coverImage
                    ? `/dynamics/podcasts/covers/${currentEpisode.belongsTo.coverImage}`
                    : noImage)}
                />
                <div>
                  <div className="font-bold line-clamp-1">{currentEpisode?.title}</div>
                  <div className="text-sm line-clamp-1">{currentEpisode.belongsTo.name}</div>
                </div>
              </div>
              <div className="grow text-sm flex gap-4 items-center">
                <div className="flex-shrink-0 min-w-8">{formatSeconds(currentTime)}</div>
                // TODO: make the player bar responsive, or change it to more basic and create the bar on touch
                <input
                  type="range"
                  value={currentTime}
                  max={duration}
                  className="w-full"
                  onChange={(event) => changeTime(+event.target.value)}
                />
                <div className="flex-shrink-0 min-w-8">{formatSeconds(duration)}</div>
              </div>
              <div className="flex gap-2 items-center">
                <button className="relative" onClick={() => changeTime(Math.max(currentTime - 10, 0))}>
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10s</div>
                  <RotateCcwIcon size={40} />
                </button>
                <button onClick={() => setIsPlaying(v => !v)} className="p-3 bg-white text-primary rounded-full self-center">
                  {isPlaying
                    ? <PauseIcon size={16} fill="tomato" />
                    : <PlayIcon size={16} fill="tomato" />}
                </button>
                <button className="relative" onClick={() => changeTime(Math.max(currentTime + 10, 0))}>
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10s</div>
                  <RotateCwIcon size={40} />
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false)
                    setCurrentEpisode(null)
                  }}
                  className="block ml-4 p-3 border-white border-2 rounded-full self-center"
                >
                  <SquareIcon size={16} fill="white" />
                </button>
              </div>
            </div>
            <audio
              ref={audioElem}
              src={currentEpisode?.contentUrl}
              className="hidden"
              onLoadedMetadata={() => {
                if (audioElem.current) setDuration(audioElem.current.duration)
              }}
            />
          </div>
          </div>
      )}
      
      <ScrollRestoration />
    </AuthContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(AuthContext)
}
