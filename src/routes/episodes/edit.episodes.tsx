import { PopulatedEpisode } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Loader } from "@/ui/loader.ui"
import { Textarea } from "@/ui/textarea.ui"
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { EditExercise, Exercise } from "./exercises/edit.exercises.edit.episode"
import { BookmarkIcon, ExternalLink, ImageIcon, Link2Icon, PlusIcon, SaveIcon, SparklesIcon, SquarePenIcon, SquarePlayIcon } from "lucide-react"
import { Embedded } from "./embeddeds/types.embededs"
import { EditEmbedded } from "./embeddeds/edit.embeddeds.edit.episodes"

interface TranscriptMutateData {
  transcript?: string
  autogenerate?: true
}

export const EditEpisode = () => {
  const { episodeId } = useParams()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [embeddeds, setEmbeddeds] = useState<Embedded[]>([])

  const { data: episode, isPending } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<PopulatedEpisode>(
      `/api/episodes/${episodeId}`
    ).then(res => res.data)
  })

  const { data: prevExercises, isPending: isLoadingExercises } = useQuery({
    queryKey: ['episodes', episodeId, 'exercises'],
    queryFn: () => axios.get<Exercise[]>(
      '/api/exercises',
      { params: { episodeId } }
    ).then(res => res.data)
  })

  useEffect(() => {
    if (prevExercises) setExercises(prevExercises)
  }, [prevExercises])
  
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


  const { mutate: mutateTranscript, isPending: isMutating } = useMutation({
    mutationKey: ['episodes', episodeId, 'transcript'],
    mutationFn: (data: TranscriptMutateData) => axios.patch(`/api/episodes/${episodeId}/transcript`, data),
    onSuccess: () => alert('Transcript saved!'),
    onError: (error) => {
      console.error(error)
      alert('There was an error saving the transcript! Please try aagain.')
    }
  })
  

  const [isGeneratingExercises, setIsGeneratingExercises] = useState(false)
  const [isSavingExercises, setIsSavingExercises] = useState(false)
  const [isSavingEmbeddeds, setIsSavingEmbeddeds] = useState(false)
  
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

  const handleExerciseChange = (index: number) => (exerciseUpdater: (exercise: Exercise) => Exercise) => {
    setExercises((prevExercises) => 
      prevExercises.map((exercise, i) => 
        i === index ? exerciseUpdater(exercise) : exercise
      )
    )
  }

  const handleEmbeddedChange = (index: number) => (embeddedUpdater: (embedded: Embedded) => Embedded) => {
    setEmbeddeds((prevEmbeddeds) => 
      prevEmbeddeds.map((embedded, i) => 
        i === index ? embeddedUpdater(embedded) : embedded
      )
    )
  }

  const generateExercisesHandler = async () => {
    try {
      setIsGeneratingExercises(true)
      const { data: generatedExercises } = await axios.post<Exercise[]>(`/api/episodes/${episodeId}/generate-exercises`)
      setExercises(exercises => [...exercises, ...generatedExercises])
    } catch (error) {
      console.error(error)
      alert('There was an error generating exercises. Please try again!')
    } finally {
      setIsGeneratingExercises(false)
    }
  }

  const saveExercisesHandler = async () => {
    try {
      setIsSavingExercises(true)
      await axios.post(`/api/exercises`, {
        episodeId: +episodeId!,
        exercises
      })
      alert('Exercises saved!')
    } catch (error) {
      console.error(error)
      alert('There was an error saving the exercises. Please try again!')
    } finally {
      setIsSavingExercises(false)
    }
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

  if (isPending) return <Loader />

  return (
    <>
      <h1>Edit episode {episodeId}</h1>
      {episode?.title}
      <Link to={`/episodes/${episodeId}`} target="_blank">
        <Button prepend={<ExternalLink size={16} />}>View published</Button>
      </Link>
      <section>
        <h2 className="font-bold text-lg mb-2">Transcript</h2>
        <Textarea
          value={transcript}
          disabled={isMutating}
          onChange={setTranscript}
        />
        <div className="flex gap-2 mt-2">
          <Button
            isLoading={isMutating}
            disabled={!transcript}
            onClick={saveTranscriptHandler}
          >Save changes</Button>
          <Button
            variant="outline"
            isLoading={isMutating}
            onClick={autogenerateTranscriptHandler}
            prepend={<SparklesIcon size={16} />}
          >Auto-generate</Button>
        </div>
      </section>
      <hr className="my-4" />
      <section>
        <h2 className="font-bold text-lg mb-2">Exercises</h2>
        {isLoadingExercises
          ? <Loader />
          : (
            <>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {exercises.map((exercise, index) => (
                  <li key={index}>
                    <EditExercise
                      exercise={exercise}
                      onChange={handleExerciseChange(index)}
                      onRemove={() => setExercises(exercises => exercises.filter((_, i) => i !== index))}
                    />
                  </li>
                ))}
                <li className="border-2 rounded-md border-dashed border-primary flex items-center justify-center flex-col gap-1 p-8">
                  <div className="mb-2 flex items-center gap-1">
                    <PlusIcon size={16} />
                    Add new exercise:
                  </div>
                  <button
                    className="text-primary"
                    onClick={() => setExercises(exercises => [
                      ...exercises,
                      { type: 'multiple-choice', question: '', correctChoice: '', incorrectChoices: [''] }
                    ])}
                  >
                    Multiple choice
                  </button>
                  <button
                    className="text-primary"
                    onClick={() => setExercises(exercises => [
                      ...exercises,
                      { type: 'select-multiple', question: '', correctChoices: [''], incorrectChoices: [''] }
                    ])}
                  >
                    Select multiple
                  </button>
                  <button
                    className="text-primary"
                    onClick={() => setExercises(exercises => [
                      ...exercises,
                      { type: 'free-response', question: '', responseModel: '' }
                    ])}
                  >
                    Free respone
                  </button>
                </li>
              </ul>
              <div className="flex gap-2 mt-8">
                <Button
                  prepend={<SaveIcon size={16} />}
                  onClick={saveExercisesHandler}
                  isLoading={isSavingExercises}
                >Save execises</Button>
                <Button
                  variant="outline"
                  onClick={generateExercisesHandler}
                  isLoading={isGeneratingExercises}
                  prepend={<SparklesIcon size={16} />}
                >
                    Auto-generate 4 exercises
                </Button>
              </div>
            </>
          )}
      </section>
      <section>
        <h2 className="font-bold text-lg mb-2">Embeddeds</h2>
        {isLoadingEmbeddeds
          ? <Loader />
          : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {embeddeds.map((embedded, index) => (
                <li key={index}>
                  <EditEmbedded
                    podcastId={episode?.belongsTo.id}
                    podcastImage={episode?.belongsTo.coverImage}
                    language={episode?.belongsTo.targetLanguage}
                    embedded={embedded}
                    onChange={handleEmbeddedChange(index)}
                    onRemove={() => setEmbeddeds(embeddeds => embeddeds.filter((_, i) => i !== index))}
                  />
                </li>
              ))}
              <li className="border-2 rounded-md border-dashed border-primary flex items-center justify-center flex-col gap-1 p-8">
                <div className="mb-2 flex items-center gap-1">
                  <PlusIcon size={14} />
                  Add new embedded:
                </div>
                <button
                  className="text-primary flex items-center gap-2"
                  onClick={() => setEmbeddeds(embeddeds => [
                    ...embeddeds,
                    { type: 'image', image: '', start: 0, duration: 15 }
                  ])}
                >
                  <ImageIcon size={14} />
                  Image
                </button>
                <button
                  className="text-primary flex items-center gap-2"
                  onClick={() => setEmbeddeds(embeddeds => [
                    ...embeddeds,
                    { type: 'word', wordId: null, start: 0, duration: 15 }
                  ])}
                >
                  <BookmarkIcon size={14} />
                  Word
                </button>
                <button
                  className="text-primary flex items-center gap-2"
                  onClick={() => setEmbeddeds(embeddeds => [
                    ...embeddeds,
                    { type: 'note', content: '', start: 0, duration: 15 }
                  ])}
                >
                  <SquarePenIcon size={14} />
                  Note
                </button>
                <button
                  className="text-primary flex items-center gap-2"
                  onClick={() => setEmbeddeds(embeddeds => [
                    ...embeddeds,
                    { type: 'link', url: '', start: 0, duration: 15 }
                  ])}
                >
                  <Link2Icon size={14} />
                  Link
                </button>
                <button
                  className="text-primary flex items-center gap-2"
                  onClick={() => setEmbeddeds(embeddeds => [
                    ...embeddeds,
                    { type: 'episode', episodeId: null, start: 0, duration: 15 }
                  ])}
                >
                  <SquarePlayIcon size={16} />
                  Episode
                </button>
              </li>
            </ul>
          )
        }
        <Button
          className="mt-8"
          prepend={<SaveIcon size={16} />}
          onClick={saveEmbeddedsHandler}
          isLoading={isSavingEmbeddeds}
        >Save embededds</Button>
      </section>
    </>
  )
}