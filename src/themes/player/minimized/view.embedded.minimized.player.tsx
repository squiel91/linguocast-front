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
import { ViewExercise } from "@/routes/episodes/exercises/view.exercises.view.episode"
import { IViewExercise } from "@/routes/episodes/exercises/types.exercises"
import { ProgressBar } from "@/ui/progress-bar.ui"
import { useEffect, useState } from "react"

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
    // enabled: !!embedded && embedded.type === 'word' && !embedded.word,
    queryKey: ['word', (embedded?.type === 'word' && ('word' in embedded ? embedded.word?.id : embedded.wordId)) ?? null ],
    queryFn: () => axios.get<Word>(`/api/words/${embedded?.type === 'word' && embedded.wordId}`).then(res => res.data)
  })

  const [catchedWord, setCatchedWord] = useState<Word | null>(null)

  useEffect(() => {
    if (catchedWord || !embedded || embedded?.type !== 'word') return
    setCatchedWord('word' in embedded ? embedded.word! : word ?? null)
  }, [catchedWord, embedded, word])

  const { data: exercise } = useQuery({
    enabled: !!embedded && embedded.type === 'exercise',
    queryKey: ['exercise', (embedded?.type === 'exercise' && embedded.exerciseId) ?? null ],
    queryFn: () => {
      if (embedded?.type !== 'exercise') return null
      return axios.get<IViewExercise>(`/api/exercises/${embedded.exerciseId}`).then(res => res.data)
    }
  })

  interface MutationVariables {
    wordId: number;
    initialSaveStatus: boolean;
  }

  const toggleWordGrab = useMutation<void, Error, MutationVariables>({
    mutationFn: async ({ wordId, initialSaveStatus }) => {
      return initialSaveStatus
        ? axios.delete(`/api/user/words/${wordId}`)
        : axios.post(`/api/user/words/${wordId}`);
    },
    onMutate: async ({ wordId, initialSaveStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['word', wordId] });

      console.log({ whatIdLookup: wordId })
      
      const previousWord = queryClient.getQueryData<Word>(['word', wordId]);
      console.log({ previousWord })
      const updatedWord: Word = {
        ...(previousWord as Word),
        saved: !initialSaveStatus
      };
      queryClient.setQueryData<Word>(['word', wordId], updatedWord);
      setCatchedWord(w => ({ ...w!, saved: !initialSaveStatus }))

      return { previousWord }
    },
    onError: (err, { initialSaveStatus }) => {
      // if (context?.previousWord) {
      //   queryClient.setQueryData<Word>(['word', wordId], context.previousWord)
      // }
      setCatchedWord(w => ({ ...w!, saved: initialSaveStatus }))
      console.error("Failed to update word grab status:", err)
    },
    onSettled: (_, __) => {
      // queryClient.invalidateQueries({ queryKey: ['word', wordId] })
      queryClient.invalidateQueries({ queryKey: ['saved-words'] })
    }
  })


  if (!embedded) return null

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
          <img src={embedded.image as string} className="w-[12rem] h-[12rem] rounded-md hover:h-72 hover:w-72 transition-all cursor-zoom-in" alt="Embedded image" />
        )}
        {embedded.type === 'episode' && episode && (
          <Link to={`/episodes/${embedded.episodeId}/${urlSafe(episode.title)}`} className="flex gap-4 items-center" onClick={expectedNavigationHandler}>
            <img src={episode.image ?? noImage} className="w-12 h-12 rounded-md border-slate-200 border-[1px]" alt={episode.title} />
            <div className="line-clamp-2">
              {episode.title}
            </div>
          </Link>
        )}
        {embedded.type === 'exercise' && exercise && (
          <ViewExercise exercise={exercise} />
        )}
        {embedded.type === 'word' && catchedWord && (
          <div className="min-w-60 max-w-md ">
            <div className="flex gap-2 items-end">
              <div className="text-2xl font-bold">{catchedWord.word}</div>
              <div className="flex-grow">{catchedWord.pronunciation}</div>
              {catchedWord.level && <div className="bg-orange-200 text-sm rounded-md px-2 self-center inline-block mb-2">HSK {catchedWord.level}</div>}
              <button
                className="bg-orange-200 ml-4 rounded-full px-4 py-2 text-sm font-bold flex gap-2 items-center"
                onClick={() => toggleWordGrab.mutate({ wordId: catchedWord.id, initialSaveStatus: catchedWord.saved })}
                disabled={toggleWordGrab.isPending}
              >
                {catchedWord.saved ? <GrabIcon size={16} /> : <HandIcon size={16} />}
                {catchedWord.saved ? 'Grabbed' : 'Grab'}
              </button>
            </div>
            <ul className="mt-2 flex gap-2 flex-wrap text-sm">
              {catchedWord.translations.map((sameMeaning, index) => (
                <li key={index} className=" bg-slate-200 py-0.5 px-2 rounded-md">{sameMeaning.join('; ')}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  )
}