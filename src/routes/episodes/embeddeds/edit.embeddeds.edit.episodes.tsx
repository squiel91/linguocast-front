import { Card } from "@/ui/card.ui"
import { EditNote } from "./embedded-types/edit.note.edit.embeddeds.edit.exercise"
import { Embedded, EpisodeEmbedded, ImageEmbedded, LinkEmbedded, NoteEmbedded } from "./types.embededs"
import { EditLink } from "./embedded-types/edit.link.edit.embeddeds.edit.exercise"
import { EditEpisode } from "./embedded-types/edit.episode.edit.embeddeds.edit.exercise"
import { EditImage } from "./embedded-types/edit.image.edit.embeddeds.edit.exercise"
import { Input } from "@/ui/input.ui"
import { EditWord } from "./embedded-types/edit.word.edit.embeddeds.edit.episodes"
import { EmbeddedTimeSelector } from "@/components/embedded-time-selector"

interface Props {
  podcastId?: number
  podcastImage?: string
  language?: string
  embedded: Embedded
  onChange: (embedded: (embedded: Embedded) => Embedded) => void
  onRemove: () => void
}

export const EditEmbedded = ({
  podcastId,
  podcastImage,
  language,
  embedded,
  onChange: changeDispatch,
  onRemove: removeHandler
}: Props) => {

  return (
    <Card className="flex flex-col gap-4 p-6">
      {embedded.type === 'note' && (
        <EditNote
          note={embedded}
          onChange={changeDispatch}
          onRemove={removeHandler}
        />
      )}
      {embedded.type === 'link' && (
        <EditLink
          link={embedded}
          onChange={changeDispatch}
          onRemove={removeHandler}
        />
      )}
      {embedded.type === 'episode' && (
        <EditEpisode
          podcastId={podcastId}
          podcastImage={podcastImage}
          episode={embedded}
          onChange={changeDispatch}
          onRemove={removeHandler}
        />
      )}
      {embedded.type === 'image' && (
        <EditImage
          image={embedded}
          onChange={changeDispatch}
          onRemove={removeHandler}
        />
      )}
      {embedded.type === 'word' && (
        <EditWord
          language={language}
          wordEmbedded={embedded}
          onChange={changeDispatch}
          onRemove={removeHandler}
        />
      )}
      <hr />
      <EmbeddedTimeSelector
        start={embedded.start}
        duration={embedded.duration}
        onStartChange={start => changeDispatch(embedded => ({ ...embedded, start }))}
        onDurationChange={duration => changeDispatch(embedded => ({ ...embedded, duration }))}
      />
    </Card>
  )
}
