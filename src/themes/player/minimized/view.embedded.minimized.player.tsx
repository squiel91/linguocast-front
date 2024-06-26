import { Embedded } from "@/routes/episodes/embeddeds/types.embededs"
import { EpisodeSuccint, Word } from "@/types/types"
import { Card } from "@/ui/card.ui"
import { ForwardLink } from "@/ui/forward-link.ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { GrabIcon, HandIcon, InfoIcon, Link2Icon } from "lucide-react"
import noImage from '@/assets/no-image.svg'
import { Link } from "react-router-dom"
import { urlSafe } from "@/utils/url.utils"
import { useEffect, useState } from "react"
import { ViewExercise } from "@/routes/episodes/exercises/view.exercises.view.episode"
import { IViewExercise } from "@/routes/episodes/exercises/types.exercises"
import { ProgressBar } from "@/ui/progress-bar.ui"

interface Props {
  embedded: Embedded | null
  showCountdown?: boolean
  onExpectedNavigation?: () => void
}

export const ViewEmbeddedMinimized = ({
  embedded,
  showCountdown = false,
  onExpectedNavigation: expectedNavigationHandler
}: Props) => {
  const queryClient = useQueryClient()
 
  const { data: episode } = useQuery({
    enabled: !!embedded && embedded.type === 'episode',
    queryKey: ['episodes-succint', (embedded?.type === 'episode' && embedded.episodeId) ?? null ],
    queryFn: () => {
      if (!embedded || embedded.type !== 'episode') return null
      return axios.get<EpisodeSuccint>(`/api/episodes/${embedded.episodeId}`, { params: { template: 'succint' } }).then(res => res.data)
    }
  })

  const { data: word } = useQuery({
    enabled: !!embedded && embedded.type === 'word' && !embedded.word,
    queryKey: ['word', (embedded?.type === 'word' && embedded.wordId) ?? null ],
    queryFn: () => {
      if (embedded?.type !== 'word') return null
      return axios.get<Word>(`/api/words/${embedded.wordId}`).then(res => res.data)
    }
  })

  const { data: exercise } = useQuery({
    enabled: !!embedded && embedded.type === 'exercise',
    queryKey: ['exercise', (embedded?.type === 'exercise' && embedded.exerciseId) ?? null ],
    queryFn: () => {
      if (embedded?.type !== 'exercise') return null
      return axios.get<IViewExercise>(`/api/exercises/${embedded.exerciseId}`).then(res => res.data)
    }
  })

  const [isGrabbedSaving, setIsGrabbedSaving] = useState(false)
  const [isGrabbed, setIsGrabbed] = useState(false)

  useEffect(() => {
    console.log('embedded changed', embedded)
  }, [embedded])

  useEffect(() => {
    console.log('word changed', word)
  }, [word])

  useEffect(() => {
    if (!embedded || embedded.type !== 'word' || (!embedded.word && !word)) return
    setIsGrabbed(((embedded.word || word) as Word).saved)
  }, [word, embedded])

  // const { mutate: saveWordMutation } = useMutation({
  //   mutationKey: ['save-word'],
  //   mutationFn: (wordId: number) => axios.post(`/api/user/words/${wordId}`),
  //   onError: (error) => {
  //     setIsGrabbed(false)
  //     console.error(error)
  //   },
  //   onMutate: () => {
  //     setIsGrabbed(true)
  //     setIsGrabbedSaving(true)
  //   },
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   onSuccess: (_, wordId) => {
  //     // queryClient.invalidateQueries({ queryKey: ['word', wordId] })
  //     // queryClient.invalidateQueries({ queryKey: ['saved-words'] })
  //   },
  //   onSettled: () => setIsGrabbedSaving(false)
  // })

  const { mutate: removeSavedWordMutation } = useMutation({
    mutationKey: ['remove-saved-word'],
    mutationFn: (wordId: number) => axios.delete(`/api/user/words/${wordId}`),
    onMutate: () => {
      setIsGrabbed(true)
      setIsGrabbedSaving(true)
    },
    onError: (error) => {
      // means that the word was already removed
      setIsGrabbed(false)
      console.error(error)
    },
    onSuccess: (_, wordId) => {
      queryClient.invalidateQueries({ queryKey: ['word', wordId] })
      queryClient.invalidateQueries({ queryKey: ['saved-words'] })
    },
    onSettled: () => setIsGrabbedSaving(false)
  })


  if (!embedded) return <></>
  return (
    <div className="container flex justify-end">
      <Card className={embedded.type === 'image' ? 'p-0' : embedded.type === 'word' || embedded.type === 'exercise' ? 'p-4' : 'relative px-3 py-2'}>
        {showCountdown && <ProgressBar duration={embedded.duration} className="absolute left-0 right-0 top-0" />}
        {embedded.type === 'note' && (
          <div className="flex gap-2">
            <InfoIcon size={16} className="text-slate-400 mt-[2px]" />
            {embedded.content}
          </div>
        )}
        {embedded.type === 'link' && (
          <div className="flex gap-2">
            <Link2Icon size={16} className="text-slate-400 mt-[2px]" />
            <ForwardLink to={embedded.url} target="_blank">
              {embedded.url}
            </ForwardLink>
          </div>
        )}
        {embedded.type === 'image' && (
          <img src={embedded.image as string} className="w-[12rem] h-[12rem] rounded-md hover:h-72 hover:w-72 transition-all cursor-zoom-in" />
        )}
        {embedded.type === 'episode' && episode && (
          <Link to={`/episodes/${embedded.episodeId}/${urlSafe(episode.title)}`} className="flex gap-4 items-center" onClick={expectedNavigationHandler}>
            <img src={episode.image ?? noImage} className="w-12 h-12 rounded-md border-slate-200 border-[1px]" />
            <div className="line-clamp-2">
              {episode.title}
            </div>
          </Link>
        )}
        {embedded.type === 'exercise' && exercise && (
          <ViewExercise exercise={exercise} />
        )}
        {embedded.type === 'word' && (word || embedded.word) && (
          <div className="min-w-60 max-w-md ">
            <div className="flex gap-2 items-baseline">
              <div className="text-2xl font-bold">{((word || embedded.word) as Word).word}</div>
              <div className="flex-grow">{((word || embedded.word) as Word).pronunciation}</div>
              <button
                className="bg-orange-200 ml-4 rounded-full px-4 py-2 text-sm font-bold flex gap-2 items-center"
                onClick={async () => {
                  if (isGrabbed) removeSavedWordMutation(((word || embedded.word) as Word).id)
                  else {
                    const wordId = ((word || embedded.word) as Word).id
                    try {
                      setIsGrabbed(true)
                      setIsGrabbedSaving(true)
                      await axios.post(`/api/user/words/${wordId}`)
                    } catch (error) {
                      console.error(error)
                      setIsGrabbed(false)
                    } finally {
                      setIsGrabbedSaving(true)
                    }
                    // saveWordMutation(((word || embedded.word) as Word).id)
                  }
                }}
                disabled={isGrabbedSaving}
              >
                {isGrabbed ? <GrabIcon size={16} /> : <HandIcon size={16} />}
                {isGrabbed ? 'Grabbed' : 'Grab'}
              </button>
            </div>
            <ul className="mt-2 flex gap-2 flex-wrap text-sm">
              {((word || embedded.word) as Word).translations.map((sameMeaning, index) => (
                <li key={index} className=" bg-slate-200 py-0.5 px-2 rounded-md">{sameMeaning.join('; ')}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  )
}