import { PopulatedEpisode } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Textarea } from "@/ui/textarea.ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { InfoIcon, RotateCcw, SaveIcon, SparklesIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface TranscriptMutateData {
  transcript?: string
  autogenerate?: true
}

export const EpisodeTranscript = () => {
  const { episodeId: rawEpisodeId } = useParams()
  const episodeId = +(rawEpisodeId!)

  const { data: episode } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<PopulatedEpisode>(
      `/api/episodes/${episodeId}`
    ).then(res => res.data)
  })

  const { mutate: mutateTranscript, isPending: isMutating } = useMutation({
    mutationKey: ['episodes', episodeId, 'transcript'],
    mutationFn: (data: TranscriptMutateData) => axios.patch(`/api/episodes/${episodeId}/transcript`, data),
    onSuccess: () => alert('Transcript saved!'),
    onError: (error) => {
      console.error(error)
      alert('There was an error saving the transcript! Please try aagain.')
    }
  })

  const [transcript, setTranscript] = useState<string | null>(null)

  useEffect(() => {
    if (!episode) return
    setTranscript(episode.transcript ?? null)
  }, [episode])

  const saveTranscriptHandler = () => {
    if (transcript) mutateTranscript({ transcript })
  }

  const autogenerateTranscriptHandler = () => {
    mutateTranscript({ autogenerate: true })
  }

  return (
    <section>
      <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl">Transcript</h2>
        <Button
          variant="outline"
          isLoading={isMutating}
          onClick={autogenerateTranscriptHandler}
          prepend={<SparklesIcon size={16} />}
        >
          Auto-generate
        </Button>
      </div>
      <p className="mb-8 p-4 rounded-md border-2 border-slate-200 flex items-center gap-3">
        <InfoIcon size={18} />
        <div>
          Time-annotated transcript that the listener can read along and look-up difficult words while listening to the episode. 
        </div>
      </p>
        <Textarea
          value={transcript}
          disabled={isMutating}
          onChange={setTranscript}
        />
        <div className="mt-8 flex gap-2">
          <Button
            isLoading={isMutating}
            disabled={!transcript}
            prepend={<SaveIcon size={16} />}
            onClick={saveTranscriptHandler}
          >
            Save changes
          </Button>
          <Button
            onClick={() => setTranscript(episode?.transcript ?? null)}
            prepend={<RotateCcw />}
            variant="discrete"
          >
            Discard changes
          </Button>
        </div>
    </section>
  )
}