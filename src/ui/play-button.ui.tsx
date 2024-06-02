import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";
import { MouseEventHandler } from "react";

interface Props {
  isPlaying: boolean
  isLoading: boolean
  onTogglePlay: MouseEventHandler<HTMLButtonElement>
}

export const PlayButton = ({ isPlaying, isLoading, onTogglePlay: togglePlayHandler}: Props) => (
  <button
    onClick={(event) => togglePlayHandler(event)}
    className="w-10 h-10 flex items-center justify-center bg-white text-primary rounded-full self-center"
    disabled={isLoading}
  >
    {isLoading
      ? <Loader2Icon className="animate-spin" size={24} />
      : isPlaying
        ? <PauseIcon size={16} fill="tomato" />
        : <PlayIcon size={16} fill="tomato" />}
  </button>
)
