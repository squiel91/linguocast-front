import { MicroPodcast, MinifiedPodcast } from "@/types/types"
import { urlSafe } from "@/utils/url.utils"
import { Link } from "react-router-dom"
import noImage from '@/assets/no-image.svg'
import { HeartIcon, MessageCircleIcon } from "lucide-react"

export const PodcastSummary = ({ podcast }: { podcast: MinifiedPodcast | MicroPodcast}) => (
  <Link
    key={podcast.id}
    to={`/podcasts/${podcast?.id}/${urlSafe(podcast?.name)}`}
    className='text-left w-full self-start'
  >
    <article>
      <img
        src={podcast.coverImage ? `/dynamics/podcasts/covers/${podcast.coverImage}` : noImage}
        className='w-full border-solid border-2 object-cover object-center aspect-square border-slate-200 rounded-lg'
      />
      {'savedCount' in podcast && (
        <div className="flex gap-4 mt-2 text-slate-400">
          <div className="flex gap-1 items-center">
            <HeartIcon size={20} />
            {podcast.savedCount}
          </div>
          <div className="flex gap-1 items-center">
            <MessageCircleIcon size={20} />
            {podcast.commentsCount}
          </div>
        </div>
      )}
      <h2 className='text-lg font-bold mt-1'>{podcast.name}</h2>
      {'description' in podcast && (
        <div className='text-slate-400 text-sm mt-1 line-clamp-2 break-words w-full'>
          {podcast.description}
        </div>
      )}
      {'levels' in podcast && (
        <div className='flex gap-2 flex-wrap text-sm mt-3'>
          {[podcast.targetLanguage, ...podcast.levels].map(tag => (
            <div
              key={tag}
              className='bg-slate-200 text-slate-700 inline-block px-3 py-1 rounded-full capitalize'
            >
              {tag}
            </div>
          ))}
        </div>
      )}
    </article>
  </Link>
)