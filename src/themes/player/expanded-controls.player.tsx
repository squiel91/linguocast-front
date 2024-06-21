import { PlayButton } from "@/ui/play-button.ui";
import { GaugeIcon, Minimize2Icon, RotateCcwIcon, RotateCwIcon } from "lucide-react";

interface Props {
  speed: number
  isLoading: boolean
  isPlaying: boolean
  onPlayToggle: () => void
  onRewind: () => void
  onForward: () => void
  onSpeedChange: (speed: number) => void
}

export const ExpandedPlayerControls = ({
  // onPlay,
  speed,
  isLoading,
  isPlaying,
  onPlayToggle: playToggleHandler,
  onRewind: rewindHandler,
  onForward: forwardHandler,
  onSpeedChange: speedChangeHandler
}: Props) => (
  <div className="grid grid-cols-3 items-center gap-4">
    <div className="flex items-center">
      {/* 0.5 0.75 1 1.25 1.5 */}
      <button
        className="flex gap-2 items-center"
        onClick={() => {
          const newSpeed = speed + .25
          speedChangeHandler(newSpeed > 1.5 ? .5 : newSpeed)
        }}
      >
        <GaugeIcon />
        X {speed}
      </button>
    </div>
    <div className="flex justify-center items-center gap-5">
      <button
        className="relative"
        onClick={rewindHandler}
        disabled={isLoading}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10</div>
        <RotateCcwIcon size={40} />
      </button>
      <PlayButton
        isLoading={isLoading}
        isPlaying={isPlaying}
        onTogglePlay={playToggleHandler}
        hero
      />
      <button
        className="relative"
        onClick={forwardHandler}
        disabled={isLoading}
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-xs">10</div>
        <RotateCwIcon size={40} />
      </button>
    </div>
    <div className="flex justify-end items-center">
      <button onClick={() => history.back()}>
        <Minimize2Icon />
      </button>
    </div>
  </div>
)
