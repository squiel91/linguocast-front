import { Loader } from "@/ui/loader.ui"
import axios from "axios"
import { useParams } from "react-router-dom"
import { IEditExercise } from "./exercises/types.exercises"
import { useEffect, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { EditExercise } from "./exercises/edit.exercises.edit.episode"
import { CircleCheckIcon, InfoIcon, RotateCcw, SaveIcon, SparklesIcon, SpellCheckIcon, SquareCheckIcon } from "lucide-react"
import { Button } from "@/ui/button.ui"
import { Dropdown } from "@/ui/dropdown.ui"
import { ViewExerciseResponsesModal } from "./exercises/view-responses-modal.exercises.episodes.creators"
import { CreatorsEpisodeDto } from "@/types/types"

export const EpisodeExercises = () => {
  const { episodeId: rawEpisodeId } = useParams()
  const episodeId = +(rawEpisodeId!)

  const [exercises, setExercises] = useState<IEditExercise[]>([])
  const [isGeneratingExercises, setIsGeneratingExercises] = useState(false)
  const [isSavingExercises, setIsSavingExercises] = useState(false)
  const [checkResponsesExercisesId, setCheckResponsesExercisesId] = useState<IEditExercise | null>(null)

  const [
    { data: episode },
    { data: prevExercises, isPending: isLoadingExercises }
  ] = useQueries({
    queries: [
      {
        queryKey: ['creators', 'episodes', episodeId],
        queryFn: () => axios.get<CreatorsEpisodeDto>(
          `/api/creators/episodes/${episodeId}`
        ).then(res => res.data)
      },
      {
        queryKey: ['creators', 'episodes', episodeId, 'exercises'],
        queryFn: () => axios.get<IEditExercise[]>(
          '/api/creators/exercises',
          { params: { episodeId } }
        ).then(res => res.data)
      }
    ]
  })

  useEffect(() => {
    if (prevExercises) setExercises(prevExercises)
  }, [prevExercises])

  const handleExerciseChange = (index: number) => (exerciseUpdater: (exercise: IEditExercise) => IEditExercise) => {
    setExercises((prevExercises) => 
      prevExercises.map((exercise, i) => 
        i === index ? exerciseUpdater(exercise) : exercise
      )
    )
  }

  const autoGenerateHandler = async () => {
    try {
      if (!episode?.transcript) return alert('You need to auto-generate the episode transcript at the "transcript" tab.')
      setIsGeneratingExercises(true)
      const { data: generatedExercises } = await axios.post<IEditExercise[]>(`/api/episodes/${episodeId}/generate-exercises`)
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

  return (
    <section>
      <div className="mb-8 flex items-center flex-wrap gap-4">
        <h2 className="text-3xl flex-grow">Exercises</h2>
        <Button
          variant="outline"
          onClick={autoGenerateHandler}
          isLoading={isGeneratingExercises}
          prepend={<SparklesIcon size={16} />}
        >
          Auto-generate
        </Button>
        <Dropdown items={[
          {
            icon: <CircleCheckIcon size={20} />,
            title: 'Multiple choice',
            description: 'Select the only correct option',
            onClick: () => setExercises(exercises => [
              ...exercises,
              { type: 'multiple-choice', question: '', correctChoice: '', incorrectChoices: [''] }
            ])
          },
          {
            icon: <SquareCheckIcon size={20} />,
            title: 'Select multiple',
            description: 'Select all the correct options',
            onClick: () => setExercises(exercises => [
              ...exercises,
              { type: 'select-multiple', question: '', correctChoices: [''], incorrectChoices: [''] }
            ])
          },
          {
            icon: <SpellCheckIcon size={20} />,
            title: 'Free respone',
            description: 'Free text response that matches the model',
            onClick: () => setExercises(exercises => [
              ...exercises,
              { type: 'free-response', question: '', response: '' }
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
          Provide exercises to evaluate learner's listening comprehension and solidify the important take-outs.
        </div>
      </p>
      {isLoadingExercises && <Loader />}
      {!isLoadingExercises && exercises && exercises.length === 0 && (
        <div>
          There are no exercises yet. Create one now!
        </div>
      )}
      {!isLoadingExercises && exercises && exercises.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exercises.map((exercise, index) => (
            <li key={index}>
              <EditExercise
                exercise={exercise}
                onChange={handleExerciseChange(index)}
                onRemove={() => setExercises(exercises => exercises.filter((_, i) => i !== index))}
                onCheckResponses={() => setCheckResponsesExercisesId(exercise)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2 mt-16">
        <Button
          prepend={<SaveIcon size={16} />}
          onClick={saveExercisesHandler}
          isLoading={isSavingExercises}
        >
          Save changes
        </Button>
        <Button
          onClick={() => setExercises(prevExercises ?? [])}
          prepend={<RotateCcw />}
          variant="discrete"
        >
          Discard changes
        </Button>
      </div>
      <ViewExerciseResponsesModal
        exercise={checkResponsesExercisesId}
        onDismiss={() => setCheckResponsesExercisesId(null)}
      />
    </section>
  )
}