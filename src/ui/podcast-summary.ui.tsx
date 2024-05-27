import { MinifiedPodcast } from "@/types/types"
import { urlSafe } from "@/utils/url.utils"
import { Link } from "react-router-dom"
import noImage from '@/assets/no-image.svg'

export const PodcastSummary = ({ podcast }: { podcast: MinifiedPodcast }) => (
  <Link
    key={podcast.id}
    to={`/podcasts/${podcast?.id}/${urlSafe(podcast?.name)}`}
    className='text-left w-full self-start'
  >
    <article>
      <img
        src={podcast.coverImage ? `/dynamics/podcasts/covers/${podcast.coverImage}` : noImage}
        className='w-full border-solid border-2 aspect-square border-slate-200 rounded-lg'
      />
      <h2 className='text-lg font-bold'>{podcast.name}</h2>
      <p className='text-slate-500 text-sm mt-1 line-clamp-2 break-words w-full'>
        {podcast.description}
      </p>
      <div className='flex gap-2 flex-wrap text-sm mt-2'>
        {[podcast.targetLanguage, ...podcast.levels].map(tag => (
          <div
            key={tag}
            className='bg-slate-200 text-slate-700 inline-block px-2 rounded-full capitalize'
          >
            {tag}
          </div>
        ))}
      </div>
    </article>
  </Link>
)