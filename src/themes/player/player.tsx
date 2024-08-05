import { RotateCcwIcon, RotateCwIcon, SquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { pause, play, stop, setTime } from "@/store/player.store";

const COMPLETED_THRESHOLD = 30 // seconds

function findMatchingEmbedded(embeddeds: Embedded[], time: number): Embedded | null {
  let bestMatch: Embedded | null = null;
  let minTimeDifference = Infinity;

  for (const embedded of embeddeds) {
    const endTime = embedded.start + embedded.duration;
    if (time >= embedded.start && time <= endTime) {
      const timeDifference = time - embedded.start;
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

  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null)

  const { user, isLoggedIn } = useAuth()

  const { episode, isPlaying, time } = useSelector((store: RootState) => store.player)
  const dispatch = useDispatch<AppDispatch>()

  const [markedCompleted, setMarkedComplete] = useState(false)

  const audioElem = useRef<HTMLAudioElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [isPlayerExpaned, setIsPlayerExpanded] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)

  useEffect(() => {
    if (!audioElem.current) return
    audioElem.current.playbackRate = playbackSpeed
  }, [playbackSpeed, audioElem])

  useEffect(() => {
    const requestWakeLock = async () => {
      if (isPlayerExpaned && episode?.transcript && 'wakeLock' in navigator) {
        try {
          const wakeLock = await navigator.wakeLock.request('screen');
          setWakeLock(wakeLock);
        } catch (err) {
          console.error(`Failed to request wake lock: ${err}`);
        }
      }
    };
  
    const releaseWakeLock = async () => {
      if (wakeLock) {
        try {
          await wakeLock.release();
          setWakeLock(null);
        } catch (err) {
          console.error(`Failed to release wake lock: ${err}`);
        }
      }
    };
  
    if (isPlayerExpaned && episode?.transcript) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }
  
    return () => {
      releaseWakeLock();
    };
  }, [isPlayerExpaned, episode?.transcript]);

  const { data: embeddeds } = useQuery({
    enabled: !!episode,
    queryKey: ['embeddeds', episode?.id ?? null],
    queryFn: () => {
      if (!episode) return []
      return axios
        .get<Embedded[]>('/api/embeddeds', { params: { episodeId: episode.id } })
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
    if (!audio || !audio.duration || !episode || !isLoggedIn || markedCompleted) return
    if (audio.duration - audio.currentTime <= COMPLETED_THRESHOLD) {
      setMarkedComplete(true)
      axios.post(`/api/episodes/${episode.id}/reproductions`, { hasCompleted: true})
        .catch(error => console.warn(error))
    }
  }, [time, episode, isLoggedIn, markedCompleted])

  useEffect(() => {
    const intervalId = setInterval(() => {
      const audio = audioElem.current
      if (!audio || !audio.duration) return
      dispatch(setTime(audio.currentTime))
      dispatch(isAudioPlaying(audio) ? play() : pause())
    }, 250)
    return () => clearInterval(intervalId)
  }, [dispatch]) // TODO optimize it to only run when it is playing

  useEffect(() => {
    const intervalId = setInterval(() => {
      const audio = audioElem.current
      if (audio && episode) {
        axios.post(`/api/episodes/${episode.id}/reproductions`, { on: Math.floor(audio.currentTime) })
        .catch(error => console.warn('Could not save user\'s listening time', error))
      }
    }, 1000 * 5)
    return () => clearInterval(intervalId)
  }, [episode]) // TODO optimize it to only run when it is playing

  const changeTime = (newTime: number) => {
    dispatch(setTime(newTime))

    if (!audioElem.current) return
    audioElem.current.currentTime = newTime
  }

  const percentageListened = (time / (episode?.duration ?? 0)) * 100 

  const [currentEmbedded, setCurrentEmbedded] = useState<Embedded | null>(null)
  
  useEffect(() => {
    setCurrentEmbedded(currentEmbedded => {
      const embedded = findMatchingEmbedded(embeddeds ?? [], time)
      if (!embedded) return null
      if (currentEmbedded && embedded!.id === currentEmbedded.id) return currentEmbedded
      return embedded
    })
  }, [embeddeds, time])

  return (
    // Don't like to put it here, but it needs to be within the React-router context
    <AuthContextWrapper>
      <div style={{ display: isPlayerExpaned ? 'none' : 'block' }}>
        <Outlet />
      </div>
      {isPlayerExpaned && (
        <div className="fixed top-0 left-0 py-4 right-0 bottom-0 min-h-screen bg-primary text-white z-20">
          <div className="container py-4 grid auto-rows-auto grid-rows-[min-content_1fr_min-content_min-content] gap-4 h-full">
            <div className="flex gap-8">
              <img
                className="w-14 h-14 aspect-square rounded-md border-2 border-slate-200"
                src={episode?.image || episode?.podcastImage || noImage}
              />
              <div>
                <h1 className="text-xl line-clamp-1">{episode?.title}</h1>
                <h2 className="text-lg">{episode?.podcastName}</h2>
              </div>
            </div>
            {episode && !episode.transcript && (
              <div className="flex flex-col items-center justify-center">
                <img
                  className="w-10/12 md:w-96 aspect-square rounded-md border-2 border-slate-200"
                  src={episode?.image || episode?.podcastImage || noImage}
                />
              </div>
            )}
            {episode?.transcript && (
              <ReadAlong
                isPremium={!!user?.isPremium}
                transcript={episode.transcript}
                currentTime={time}
                onTimeChangeRequest={changeTime}
                language={episode.targetLanguage}
                onMinimizeRequest={() => setIsPlayerExpanded(false)}
                embedded={<ViewEmbeddedMinimized onExpectedNavigation={() => setIsPlayerExpanded(false)} embedded={currentEmbedded} />}
              />
            )}
            <div>
              <ExpandedPlayerControls
                isPlaying={isPlaying}
                speed={playbackSpeed}
                isLoading={isLoading}
                onPlayToggle={() => dispatch(isPlaying ? pause() : play())}
                onRewind={() => changeTime(Math.max(time - 10, 0))}
                onForward={() => changeTime(time + 10)}
                onSpeedChange={(speed) => setPlaybackSpeed(speed)}
              />
            </div>
            <div className="grow text-sm gap-4 items-center flex">
              <div className="flex-shrink-0 min-w-8">{formatSeconds(time)}</div>
              <input
                type="range"
                value={time}
                max={episode?.duration ?? 0}
                className="w-full"
                onChange={(event) => changeTime(+event.target.value)}
              />
              <div className="flex-shrink-0 min-w-8">{formatSeconds(episode?.duration ?? 0)}</div>
            </div>
          </div>
        </div>
      )}
      {episode && !isPlayerExpaned && (
        <>
          <div className="fixed left-0 bottom-0 right-0 rounded-md md:px-4 z-10 flex gap-2 flex-col">
            <ViewEmbeddedMinimized embedded={currentEmbedded} />
            <div
              className="container flex flex-col p-0 bg-primary  rounded-tr-lg rounded-tl-lg text-white text-left"
              onClick={() => setIsPlayerExpanded(true)}
            >
              <div className="p-3 pb-2 w-full">
                <div className="flex justify-between gap-8">
                  <div className="flex gap-4 flex-grow">
                    <img
                      className="w-12 h-12 rounded-md border-2 border-slate-200"
                      src={episode.image|| episode.podcastImage || noImage}
                    />
                    <div>
                      <div className="font-bold line-clamp-1">{episode?.title}</div>
                      <div className="text-sm line-clamp-1">{episode.podcastName}</div>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      className="relative hidden md:block"
                      onClick={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        changeTime(Math.max(time - 10, 0))
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
                        dispatch(isPlaying ? pause() : play())
                      }}
                    />
                    <button
                      className="relative hidden md:block"
                      onClick={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        changeTime(time + 10)
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
                        dispatch(stop())
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
      {episode && (
        <audio
          ref={audioElem}
          src={episode?.contentUrl}
          onCanPlay={() => setIsLoading(false)}
          className="hidden"
          onLoadedMetadata={() => {
            if (!audioElem.current) return
            if (episode.leftOn) audioElem.current.currentTime = episode.leftOn
            audioElem.current.play()
          }}
        />
      )}
      <ScrollRestoration />
    </AuthContextWrapper>
  )
}
