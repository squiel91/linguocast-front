import { Button } from "@/ui/button.ui"
import { PlaySquareIcon, Trash2Icon } from "lucide-react"
import { Embedded, EpisodeEmbedded } from "../types.embededs"
import { useQuery } from "@tanstack/react-query"
import { Select } from "@/ui/select.ui"
import axios from "axios"
import noImage from '@/assets/no-image.svg'

export interface Props {
  podcastId?: number
  podcastImage?: string
  episode: EpisodeEmbedded
  onChange: (embedded: (embedded: Embedded) => Embedded) => void
  onRemove: () => void
}

interface TinyEpisode {
  id: number
  title: string
  image: string
}

export const EditEpisode = ({
  podcastId,
  podcastImage,
  episode: { episodeId },
  onChange: changeDispatch, onRemove
}: Props) => {
  const { data: tinyEpisodes, isPending: isLoading, isError } = useQuery({
    enabled: !!podcastId,
    queryKey: ['tiny-episodes', podcastId],
    queryFn: () => axios.get<TinyEpisode[]>('/api/episodes', { params: { podcastId } })
      .then(res => res.data)
  })

  const selectedExercise = episodeId ? tinyEpisodes?.find(episode => episode.id === episodeId) ?? null : null

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold flex items-center gap-2">
          <PlaySquareIcon size={14} />
          Episode
        </div>
        <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
      </div>
      {isError && <div>There was an error loading episodes</div>}
      {isLoading && <div>Loading episodes...</div>}
      {tinyEpisodes && tinyEpisodes.length === 0 && <div>No episodes found</div>}
      {tinyEpisodes && tinyEpisodes.length > 0 && (
        <Select
          value={`${episodeId}`}
          options={tinyEpisodes?.map(episode => ({ value: `${episode.id}`, text: episode.title }))}
          onChange={value => changeDispatch(episode => ({ ...episode, episodeId: value ? +value : null }))}
        />
      )}
      {selectedExercise && (
        <div>
          <div className="mb-2 text-sm">
            Preview
          </div>
          <div className="flex gap-4 items-center">
            <img src={selectedExercise.image || podcastImage || noImage} className="w-12 h-12 rounded-md border-slate-200 border-[1px]" />
            <div className="line-clamp-2">
              {selectedExercise.title}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
