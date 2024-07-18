import { cn } from "@/utils/styles.utils";
import { Loader2Icon, PauseIcon, PlayIcon } from "lucide-react";
import { MouseEventHandler } from "react";

interface Props {
  isPlaying: boolean
  isLoading: boolean
  onTogglePlay: MouseEventHandler<HTMLButtonElement>
  hero?: boolean
  overWhite?: boolean
}

export const PlayButton = ({ isPlaying, overWhite = false, isLoading, hero = false, onTogglePlay: togglePlayHandler}: Props) => (
  <button
    onClick={(event) => togglePlayHandler(event)}
    className={cn(hero ? 'w-14 h-14' : 'w-10 h-10', 'flex-shrink-0 flex items-center justify-center bg-white text-primary rounded-full self-center', overWhite ? 'bg-primary text-white' : '')}
    disabled={isLoading}
  >
    {isLoading
      ? <Loader2Icon className="animate-spin" size={24} />
      : isPlaying
        ? <PauseIcon size={hero ? 32 : 16} fill={overWhite ? 'white' : 'tomato'} />
        : <PlayIcon size={hero ? 32 : 16} fill={overWhite ? 'white' : 'tomato'} />}
  </button>
)
