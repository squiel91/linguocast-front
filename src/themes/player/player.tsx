import { PopulatedEpisode } from "@/types/types";
import { Minimize2Icon, RotateCcwIcon, RotateCwIcon, SquareIcon } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import noImage from '@/assets/no-image.svg'
// import { formatSeconds } from "@/utils/date.utils";
import { AuthContextWrapper, useAuth } from "@/auth/auth.context";
import axios from "axios";
import { isAudioPlaying } from "@/utils/player.utils";
import { PlayButton } from "@/ui/play-button.ui";
import { formatSeconds } from "@/utils/date.utils";
import { useNavigate } from 'react-router-dom';

const COMPLETED_THRESHOLD = 30 // seconds

interface Player {
  currentEpisode: PopulatedEpisode | null
  isPlaying: boolean
  reproduce: (episode: PopulatedEpisode) => void
  play: () => void
  pause: () => void
}

export const PlayerContext = createContext<Player>({
  currentEpisode: null,
  isPlaying: false,
  reproduce: () => console.log('reproduce'),
  play: () => console.log('pause'),
  pause: () => console.log('pause')

})

export const PlayerContextWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn } = useAuth()

  const [currentEpisode, setCurrentEpisode] = useState<PopulatedEpisode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [markedCompleted, setMarkedComplete] = useState(false)
  const audioElem = useRef<HTMLAudioElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isPlayerExpaned, setIsPlayerExpanded] = useState(false)

  useEffect(() => {
    if (isPlayerExpaned) {
      navigate(`${location.pathname}#player`);
      
      const handleBackButtonClick = () => {
        setIsPlayerExpanded(false)
        navigate(location.pathname, { replace: true });
      }
      window.addEventListener('popstate', handleBackButtonClick);
      return () => {
        window.removeEventListener('popstate', handleBackButtonClick);
      };
    }
  }, [isPlayerExpaned, navigate, location.pathname]);

  useEffect(() => {
    const audio = audioElem.current
    if (!audio) return
    if (isPlaying) audio.play()
    else audio.pause()
  }, [isPlaying])

  useEffect(() => {
    const audio = audioElem.current
    if (!audio || !audio.duration || !currentEpisode || !isLoggedIn || markedCompleted) return
    if (audio.duration - audio.currentTime <= COMPLETED_THRESHOLD) {
      setMarkedComplete(true)
      axios.post(`/api/episodes/${currentEpisode.id}/reproductions`, { hasCompleted: true})
        .catch(error => console.warn(error))
    }
  }, [currentTime, currentEpisode, isLoggedIn, markedCompleted])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const audio = audioElem.current
      if (!audio || !audio.duration) return
      setCurrentTime(audio.currentTime)
      setIsPlaying(isAudioPlaying(audio))
    }, 200)
    return () => clearInterval(intervalId)
  }, []) // TODO optimize it to only run when it is playing

  useEffect(() => {
    const intervalId = setInterval(() => {
      const audio = audioElem.current
      if (audio && currentEpisode) {
        axios.post(`/api/episodes/${currentEpisode.id}/reproductions`, { on: Math.floor(audio.currentTime) })
        .catch(error => console.warn('Could not save user\'s listening time', error))
      }
    }, 1000 * 5)
    return () => clearInterval(intervalId)
  }, [currentEpisode]) // TODO optimize it to only run when it is playing

  const changeTime = (newTime: number) => {
    setCurrentTime(newTime)
    if (!audioElem.current) return
    audioElem.current.currentTime = newTime
  }

  const percentageListened = (currentTime / duration) * 100 

  return (
    <AuthContextWrapper>
      <PlayerContext.Provider
        value={{
          currentEpisode: currentEpisode,
          isPlaying: isPlaying,
          reproduce: (episode) => {
            if (episode !== currentEpisode) setIsLoading(true)
            setCurrentEpisode(episode)
            setIsPlaying(true)
          },
          play: () => setIsPlaying(true),
          pause: () => setIsPlaying(false)
        }}
      >
        <div style={{ display: isPlayerExpaned ? 'none' : 'block' }}>
          <Outlet />
        </div>
        {isPlayerExpaned && (
          <div className="fixed top-0 left-0 right-0 min-h-screen bg-primary text-white z-20">
            <div className="container py-4">
              <button onClick={() => history.back()}>
                <Minimize2Icon />
              </button>
              <div className="flex gap-8">
                <img
                  className="w-40 aspect-square rounded-md border-2 border-slate-200"
                  src={currentEpisode?.image ?? (currentEpisode?.belongsTo.coverImage
                    ? `/dynamics/podcasts/covers/${currentEpisode.belongsTo.coverImage}`
                    : noImage)}
                />
                <div>
                  <h1 className="text-2xl font-bold">{currentEpisode?.title}</h1>
                  <h2 className="text-lg">{currentEpisode?.belongsTo.name}</h2>
                </div>
              </div>
              <PlayButton
                isLoading={isLoading}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(v => !v)}
              />
              <div className="grow text-sm gap-4 items-center flex">
                <div className="flex-shrink-0 min-w-8">{formatSeconds(currentTime)}</div>
                <input
                  type="range"
                  value={currentTime}
                  max={duration}
                  className="w-full"
                  onChange={(event) => changeTime(+event.target.value)}
                />
                <div className="flex-shrink-0 min-w-8">{formatSeconds(duration)}</div>
              </div>
            </div>
          </div>
        )}
        {currentEpisode && !isPlayerExpaned && (
          <div className="fixed left-0 bottom-0 right-0 rounded-md md:px-4 z-10">
            <button
              className="container flex flex-col p-0 bg-primary  rounded-tr-lg rounded-tl-lg text-white text-left"
              onClick={() => setIsPlayerExpanded(true)}
            >
              <div className="p-3 pb-2 w-full">
                <div className="flex justify-between gap-8">
                  <div className="flex gap-4 flex-grow">
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
                  <div className="flex gap-2 items-center">
                    <button className="relative hidden md:block" onClick={() => changeTime(Math.max(currentTime - 10, 0))} disabled={isLoading}>
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10'</div>
                      <RotateCcwIcon size={40} />
                    </button>
                    <PlayButton
                      isLoading={isLoading}
                      isPlaying={isPlaying}
                      onTogglePlay={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        setIsPlaying(v => !v)
                      }}
                    />
                    <button className="relative hidden md:block" onClick={() => changeTime(Math.max(currentTime + 10, 0))} disabled={isLoading}>
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10'</div>
                      <RotateCwIcon size={40} />
                    </button>
                    <button
                      onClick={() => {
                        setIsPlaying(false)
                        setCurrentEpisode(null)
                      }}
                      className="w-10 h-10 flex items-center justify-center border-white border-2 rounded-full self-center"
                    >
                      <SquareIcon size={16} fill="white" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-orange-300 w-full h-1">
                <div className="h-full w-0 bg-red-600" style={{ width: `${percentageListened}%` }} />
              </div>
            </button>
          </div>
        )}
        {currentEpisode && (
          <audio
            ref={audioElem}
            src={currentEpisode?.contentUrl}
            onCanPlay={() => setIsLoading(false)}
            className="hidden"
            onLoadedMetadata={() => {
              if (!audioElem.current) return
              setDuration(audioElem.current.duration)
              if (currentEpisode.leftOn) {
                audioElem.current.currentTime = currentEpisode.leftOn
              }
              audioElem.current.play()
            }}
          />
        )}
        <ScrollRestoration />
      </PlayerContext.Provider>
    </AuthContextWrapper>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
