import { PopulatedEpisode } from "@/types/types";
import { RotateCcwIcon, RotateCwIcon, SquareIcon } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import noImage from '@/assets/no-image.svg'
import { AuthContextWrapper, useAuth } from "@/auth/auth.context";
import axios from "axios";
import { isAudioPlaying } from "@/utils/player.utils";
import { PlayButton } from "@/ui/play-button.ui";
import { formatSeconds } from "@/utils/date.utils";
import { useNavigate } from 'react-router-dom';
import { Embedded } from "@/routes/episodes/embeddeds/types.embededs";
import { useQuery } from "@tanstack/react-query";
import { ViewEmbeddedMinimized } from "./minimized/view.embedded.minimized.player";
import { ReadAlong } from "./read-along.player";
import { ExpandedPlayerControls } from "./expanded-controls.player";

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

function findMatchingEmbedded(embeddeds: Embedded[], currentTime: number): Embedded | null {
  let bestMatch: Embedded | null = null;
  let minTimeDifference = Infinity;

  for (const embedded of embeddeds) {
    const endTime = embedded.start + embedded.duration;
    if (currentTime >= embedded.start && currentTime <= endTime) {
      const timeDifference = currentTime - embedded.start;
      if (bestMatch === null || timeDifference < minTimeDifference) {
        bestMatch = embedded;
        minTimeDifference = timeDifference;
      }
    }
  }

  return bestMatch;
}

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
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  useEffect(() => {
    if (!audioElem.current) return
    audioElem.current.playbackRate = playbackSpeed
  }, [playbackSpeed, audioElem])

  const { data: embeddeds } = useQuery({
    enabled: !!currentEpisode,
    queryKey: ['embeddeds', currentEpisode?.id ?? null],
    queryFn: () => {
      if (!currentEpisode) return []
      return axios
        .get<Embedded[]>('/api/embeddeds', { params: { episodeId: currentEpisode.id } })
        .then(res => res.data)
    }
  })

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
    }, 250)
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
          <div className="fixed top-0 left-0 py-4 right-0 bottom-0 min-h-screen bg-primary text-white z-20">
            <div className="container py-4 grid auto-rows-auto grid-rows-[min-content_1fr_min-content_min-content] gap-4 h-full">
              {/* <div className="bg-red-500 ">hello</div> */}
              <div className="flex gap-8 flex-col">
                <div className="flex gap-8 items-center">
                  <img
                    className="w-14 h-14 aspect-square rounded-md border-2 border-slate-200"
                    src={currentEpisode?.image || currentEpisode?.belongsTo.coverImage || noImage}
                  />
                  <div>
                    <h1 className="text-xl font-bold line-clamp-1">{currentEpisode?.title}</h1>
                    <h2 className="text-lg">{currentEpisode?.belongsTo.name}</h2>
                  </div>
                </div>
              </div>
              {currentEpisode?.transcript && (
                <ReadAlong
                  transcript={currentEpisode.transcript}
                  currentTime={currentTime}
                  onTimeChangeRequest={changeTime}
                  embedded={<ViewEmbeddedMinimized embedded={findMatchingEmbedded(embeddeds ?? [], currentTime)} />}
                />
              )}
              <div>
                <ExpandedPlayerControls
                  isPlaying={isPlaying}
                  speed={playbackSpeed}
                  isLoading={isLoading}
                    // onPlay,
                  onPlayToggle={() => setIsPlaying(v => !v)}
                  onRewind={() => changeTime(Math.max(currentTime - 10, 0))}
                  onForward={() => changeTime(currentTime + 10)}
                  onSpeedChange={(speed) => setPlaybackSpeed(speed)}
                />
              </div>
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
          <>
            <div className="fixed left-0 bottom-0 right-0 rounded-md md:px-4 z-10 flex gap-2 flex-col">
              <ViewEmbeddedMinimized embedded={findMatchingEmbedded(embeddeds ?? [], currentTime)} />
              <div
                className="container flex flex-col p-0 bg-primary  rounded-tr-lg rounded-tl-lg text-white text-left"
                onClick={() => setIsPlayerExpanded(true)}
              >
                <div className="p-3 pb-2 w-full">
                  <div className="flex justify-between gap-8">
                    <div className="flex gap-4 flex-grow">
                      <img
                        className="w-12 h-12 rounded-md border-2 border-slate-200"
                        src={currentEpisode.image|| currentEpisode.belongsTo.coverImage || noImage}
                      />
                      <div>
                        <div className="font-bold line-clamp-1">{currentEpisode?.title}</div>
                        <div className="text-sm line-clamp-1">{currentEpisode.belongsTo.name}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button
                        className="relative hidden md:block"
                        onClick={event => {
                          event.stopPropagation()
                          event.preventDefault()
                          changeTime(Math.max(currentTime - 10, 0))
                        }}
                        disabled={isLoading}
                      >
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
                      <button
                        className="relative hidden md:block"
                        onClick={event => {
                          event.stopPropagation()
                          event.preventDefault()
                          changeTime(currentTime + 10)
                        }}
                        disabled={isLoading}
                      >
                        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10'</div>
                        <RotateCwIcon size={40} />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation()
                          event.preventDefault()
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
              </div>
            </div>
          </>
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
