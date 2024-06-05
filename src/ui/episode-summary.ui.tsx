import { Episode } from "@/types/types"
import { readableDate } from "@/utils/date.utils"
import { Link } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { urlSafe } from "@/utils/url.utils"
import { ListeningProgressBar } from "./listening-progress-bar.ui"
import { CalendarIcon } from "lucide-react"

interface Props {
  episode: Episode
}

export const EpisodeSummary = ({ episode }: Props) => (
  <Link
    to={`/episodes/${episode.id}/${urlSafe(episode.title)}`}
    className='text-left w-full self-start'
  >
    <img
      src={episode.image ?? (episode.podcastImage
        ? `/dynamics/podcasts/covers/${episode.podcastImage}`
        : noImage)}
      className="w-full border-solid border-2 object-cover object-center aspect-square border-slate-200 rounded-lg"
    />
    <div className='text-lg font-bold mt-3 line-clamp-2 leading-tight'>{episode.title}</div>
    <div className='text-sm mt-1 line-clamp-1'>{episode.podcastName}</div>
    { episode.leftOn && (
      <ListeningProgressBar
        duration={episode.duration}
        leftOn={episode.leftOn}
        className="text-sm mt-2"
      />
    )} 
    {! episode.leftOn && (
      <div className="text-sm mt-1 flex gap-2">
        <CalendarIcon size={16} strokeWidth={1} />
        {readableDate(episode.publishedAt)}
      </div>
    )}
  </Link>
)