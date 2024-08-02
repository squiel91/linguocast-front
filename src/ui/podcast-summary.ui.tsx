import { MicroPodcast, MinifiedPodcast } from "@/types/types"
import { urlSafe } from "@/utils/url.utils"
import { Link } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { LibraryIcon, MessageCircleIcon, RepeatIcon } from "lucide-react"
import { relativeTime } from "@/utils/date.utils"

function isPodcastInactive(lastEpisodeDate?: string | Date): boolean {
  if (!lastEpisodeDate) return false
  const lastEpisode = new Date(lastEpisodeDate);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  
  return lastEpisode < threeMonthsAgo;
}

export const PodcastSummary = ({ podcast }: { podcast: MinifiedPodcast | MicroPodcast}) => (
  <Link
    key={podcast.id}
    to={`/podcasts/${podcast?.id}/${urlSafe(podcast?.name)}`}
    className='text-left w-full self-start'
  >
    <article>
      <div className="relative">
        <img
          src={podcast.coverImage ?? noImage}
          className='w-full border-solid border-2 object-cover object-center aspect-square border-slate-200 rounded-md'
        />
        {'lastEpisodeDate' in podcast && isPodcastInactive(podcast.lastEpisodeDate) && (
          <div className="absolute bottom-4 right-4 bg-slate-300 rounded-md px-2 flex gap-1 items-center text-sm" title="This means that the podcast has not realeased an episode for the past 3 months.">Inactive</div>
        )}
      </div>
      {'savedCount' in podcast && (
        <div className="flex gap-4 mt-2 text-slate-400">
          <div className="flex gap-2 items-center" title="Followers">
            <RepeatIcon size={18} />
            {podcast.savedCount}
          </div>
          <div className="flex gap-2 items-center" title="Reviews">
            <MessageCircleIcon size={20} />
            {podcast.commentsCount}
          </div>
          <div className="flex gap-2 items-center" title="Episodes">
            <LibraryIcon size={20} />
            {podcast.episodesCount}
          </div>
        </div>
      )}
      <h2 className='text-lg mt-1'>{podcast.name}</h2>
      {'description' in podcast && (
        <div className='text-slate-400 text-sm mt-1 line-clamp-2 break-words w-full'>
          {podcast.description}
        </div>
      )}
      {'lastEpisodeDate' in podcast && podcast.lastEpisodeDate && (
        <div className="mt-2">Last episode: {relativeTime(podcast.lastEpisodeDate)}</div>
      )}
      {'levels' in podcast && (
        <div className='flex gap-2 flex-wrap text-sm mt-3'>
          <div
            className='bg-slate-200 text-slate-700 px-3 py-1 rounded-md capitalize inline-flex gap-1'
          >
            <img src={`/flags/${podcast.targetLanguage}.svg`} className="w-4" />
            {podcast.targetLanguage}
          </div>
          {podcast.levels.map(tag => (
            <div
              key={tag}
              className='bg-slate-200 text-slate-700 inline-block px-3 py-1 rounded-md capitalize'
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </article>
  </Link>
)