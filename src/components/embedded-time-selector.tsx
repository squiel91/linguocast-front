import { Input } from "@/ui/input.ui"
import { cn } from "@/utils/styles.utils"

interface Props {
  start: number
  duration: number
  className?: string
  onStartChange: (value: number) => void
  onDurationChange: (value: number) => void
}

export const EmbeddedTimeSelector = ({
  start,
  duration,
  className,
  onStartChange: startChangeHandler,
  onDurationChange: durationChangeHandler
}: Props) => (
  <div className={cn('flex gap-4', className)}>
    <div>
      <div className="text-sm mb-1">Start at (min : sec)</div>
      <div className="grid grid-cols-[1fr_max-content_1fr] items-center gap-2">
        <Input
          type="number"
          min={0}
          value={`${Math.floor(start / 60)}`}
          onChange={value => startChangeHandler((value ? Math.max(Math.trunc(+value), 0) : 0) * 60 + start % 60)}
        />
        :
        <Input
          type="number"
          min={0}
          max={59}
          value={`${Math.floor(start % 60)}`}
          onChange={value => startChangeHandler(Math.floor(start / 60) * 60 + (value ? Math.min(Math.max(Math.trunc(+value), 0), 59) : 0))}
        />
      </div>
    </div>
    <div>
      <div className="text-sm mb-1">Duration (sec)</div>
      <Input
        type="number"
        min={1}
        value={`${duration}`}
        onChange={(value) => durationChangeHandler(value ? Math.max(Math.trunc(+value), 0) : 15)}
      />
    </div>
  </div>
)
