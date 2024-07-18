import { formatSeconds } from "@/utils/date.utils"
import { cn } from "@/utils/styles.utils"

interface Props {
  duration: number
  leftOn: number
  onlyBar?: boolean
  className?: string
}

export const ListeningProgressBar = ({
  duration,
  leftOn,
  onlyBar = false,
  className
}: Props) => (
    <div className={cn('flex gap-4 items-center w-full', className)}>
      <div className="bg-slate-200 flex-grow h-1 rounded-full">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${Math.min((leftOn / duration) * 100, 100)}%` }}
        />
      </div>
      {!onlyBar && <span>{formatSeconds(duration - leftOn)} left</span>}
    </div>
)

