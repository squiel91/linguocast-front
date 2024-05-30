import { PopulatedEpisode } from "@/types/types"
import { EpisodeSummary } from "./summery.episodes.view.podcasts"
import { Button } from "@/ui/button.ui"

interface Props {
  episodes: PopulatedEpisode[]
  totalEpisodes: number
}

export const ListEpisodes = ({ episodes, totalEpisodes }: Props) => (
  <div>
    <div className="pb-2 border-b-2 mt-8 text-slate-400">
      Episodes ({totalEpisodes})
    </div>
    <ul>
      {episodes.length === 0
        ? <li className="mt-4">Add an RSS Feed to show the episodes</li>
        : episodes.map(episode => (
          <EpisodeSummary key={episode.id} episode={episode} />
        ))
      }
    </ul>
    {episodes.length < totalEpisodes && (
      <Button variant="outline" className="mt-4">Load more</Button>
    )}
    
  </div>
)