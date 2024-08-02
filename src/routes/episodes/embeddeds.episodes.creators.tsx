import { useParams } from "react-router-dom"
import { Embedded } from "./embeddeds/types.embededs"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader } from "@/ui/loader.ui"
import { EditEmbedded } from "./embeddeds/edit.embeddeds.edit.episodes"
import { BookmarkIcon, ImageIcon, InfoIcon, LibraryIcon, Link2Icon, RotateCcw, SaveIcon, SquarePenIcon } from "lucide-react"
import { Button } from "@/ui/button.ui"
import { Dropdown } from "@/ui/dropdown.ui"
import { MinifiedEpisode } from "@/types/types"

export const EpisodeEmbeddeds = () => {
  const { episodeId: rawEpisodeId } = useParams()
  const episodeId = +(rawEpisodeId!)

  const [embeddeds, setEmbeddeds] = useState<Embedded[]>([])
  
  const { data: episode } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<MinifiedEpisode>(
      `/api/episodes/${episodeId}`
    ).then(res => res.data)
  })

  const { data: prevEmbeddeds, isPending: isLoadingEmbeddeds } = useQuery({
    queryKey: ['episodes', episodeId, 'embeddeds'],
    queryFn: () => axios.get<Embedded[]>(
      '/api/embeddeds',
      { params: { episodeId } }
    ).then(res => res.data.filter(({ type }) => type !== 'exercise'))
  })

  useEffect(() => {
    if (prevEmbeddeds) setEmbeddeds(prevEmbeddeds)
  }, [prevEmbeddeds])

  const [isSavingEmbeddeds, setIsSavingEmbeddeds] = useState(false)

  const handleEmbeddedChange = (index: number) => (embeddedUpdater: (embedded: Embedded) => Embedded) => {
    setEmbeddeds((prevEmbeddeds) => 
      prevEmbeddeds.map((embedded, i) => 
        i === index ? embeddedUpdater(embedded) : embedded
      )
    )
  }

  const saveEmbeddedsHandler = async () => {
    try {
      setIsSavingEmbeddeds(true)
      await axios.post(`/api/embeddeds`, {
        episodeId: +episodeId!,
        embeddeds
      })
      alert('Embedded saved!')
    } catch (error) {
      console.error(error)
      alert('There was an error saving the embeddeds. Please try again!')
    } finally {
      setIsSavingEmbeddeds(false)
    }
  }

  return (
    <section>
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl">Embeddeds</h2>
        <Dropdown items={[
          {
            icon: <ImageIcon size={20} />,
            title: 'Image',
            description: 'Display an image',
            onClick: () => setEmbeddeds(embeddeds => [
              ...embeddeds,
              { type: 'image', image: '', start: 0, duration: 15 }
            ])
          },
          {
            icon: <SquarePenIcon size={20} />,
            title: 'Note',
            description: 'Show a text note',
            onClick: () => setEmbeddeds(embeddeds => [
              ...embeddeds,
              { type: 'note', content: '', start: 0, duration: 15 }
            ])
          },
          {
            icon: <BookmarkIcon size={20} />,
            title: 'Word',
            description: 'Highlight key words',
            onClick: () => setEmbeddeds(embeddeds => [
              ...embeddeds,
              { type: 'word', wordId: null, start: 0, duration: 15 }
            ])
          },
          {
            icon: <Link2Icon size={20} />,
            title: 'Link',
            description: 'Link to external resources',
            onClick: () => setEmbeddeds(embeddeds => [
              ...embeddeds,
              { type: 'link', url: '', start: 0, duration: 15 }
            ])
          },
          {
            icon: <LibraryIcon size={20} />,
            title: 'Episode',
            description: 'Link to a related episodes',
            onClick: () => setEmbeddeds(embeddeds => [
              ...embeddeds,
              { type: 'episode', episodeId: null, start: 0, duration: 15 }
            ])
          }
        ]}
        >
          Add new
        </Dropdown>
      </div>
      <p className="mb-8 p-4 rounded-md border-2 border-slate-200 flex items-center gap-3">
        <InfoIcon size={18} />
        <div>
          Provide complementary context to your lesson by attatching images, notes, external links, and much more, that pops-up at specific times.
        </div>
      </p>
      {isLoadingEmbeddeds && <Loader />}
      {!isLoadingEmbeddeds && embeddeds && embeddeds.length === 0 && (
        <div>
          There are no embeddeds yet. Create one now!
        </div>
      )}
      {!isLoadingEmbeddeds && embeddeds && embeddeds.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {embeddeds.map((embedded, index) => (
            <li key={index}>
              <EditEmbedded
                podcastId={episode?.podcastId}
                podcastImage={episode?.podcastImage}
                language={episode?.targetLanguage}
                embedded={embedded}
                onChange={handleEmbeddedChange(index)}
                onRemove={() => setEmbeddeds(embeddeds => embeddeds.filter((_, i) => i !== index))}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 mt-16">
        <Button
          prepend={<SaveIcon size={16} />}
          onClick={saveEmbeddedsHandler}
          isLoading={isSavingEmbeddeds}
        >Save changes</Button>
        <Button
          onClick={() => setEmbeddeds(prevEmbeddeds ?? [])}
          prepend={<RotateCcw />}
          variant="discrete"
        >
          Discard changes
        </Button>
      </div>
    </section>
  )
}