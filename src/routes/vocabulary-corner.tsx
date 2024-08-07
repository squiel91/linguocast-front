import { WordDetailsModal } from "@/components/word-details-modal"
import { WordViewer } from "@/components/word-viewer"
import { Word } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import Dialog from "@/ui/dialog.ui"
import { ForwardLink } from "@/ui/forward-link.ui"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { daySinceEpoche } from "@/utils/date.utils"
import { useTitle } from "@/utils/document.utils"
import { getRandomWholeNumber } from "@/utils/random.utils"
import { cn } from "@/utils/styles.utils"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { BookOpenCheckIcon, BrushIcon, EraserIcon, EyeIcon, Maximize2Icon, PartyPopperIcon, SearchIcon, Undo2Icon, XIcon } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"

const WordCorner = () => {
  const [q, setQ] = useState<string | null>(null)
  const [isSketchOpen, setIsSketchOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewedWordIds, setReviewedWordIds] = useState<number[]>([])
  const [removedWordIds, setRemovedWordIds] = useState<number[]>([])
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null)
  const { data: savedWords, isPending } = useQuery({
    queryKey: ['saved-words'],
    queryFn: () => axios.get<Word[]>('/api/user/words').then(res => res.data)
  })

  const sketchboard = useRef<ReactSketchCanvasRef>(null) 

  const reviewDue = useMemo(() => {
    const currentDay = daySinceEpoche()
    return savedWords?.filter(
        ({ id, reviewScheduledFor }) => ((reviewScheduledFor <= currentDay) && (!reviewedWordIds.includes(id)))
    ) ?? []
  }
  , [savedWords, reviewedWordIds])

  const filteredSavedWords = q
    ? savedWords?.filter(word => (word.word.includes(q.toLowerCase()) || word.translations.flat().join('|').toLowerCase().includes(q.toLowerCase())))
    : savedWords

  useTitle('Vocabulary Corner')

  // State and handlers for the review dialog
  // NOTE: I brought it into the parent component because I could not make it work properly, it was rerendering and revealing masked elements
  // TODO: separate into a different component
  const [isWordShown, setIsWordShown] = useState(false)
  const [isReveled, setIsReveled] = useState(false)
  const [isPronunciationShown, setIsPronunciationShown] = useState(false)
  const [isTranslationsShown, setIsTranslationsShown] = useState(false)
  const [isLoading, setIsLoading] = useState<'easy' | 'medium' | 'hard' | null>(null)
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  
  useEffect(() => {
    setCurrentWord(reviewDue.at(0) ?? null)
  }, [reviewDue])


  const queryClient = useQueryClient()

  useEffect(() => {
    const randomNumber = getRandomWholeNumber(2)

    setIsReveled(false) 
    if (randomNumber === 0) {
      setIsWordShown(true)
      setIsPronunciationShown(false)
      setIsTranslationsShown(false)
    } else if (randomNumber === 1) {
      setIsWordShown(false)
      setIsPronunciationShown(true)
      setIsTranslationsShown(false)
    } else {
      setIsWordShown(false)
      setIsPronunciationShown(false)
      setIsTranslationsShown(true)
    }
  }, [currentWord])

  const scoreReviewHandler = async (difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      setIsLoading(difficulty)
      await axios.patch(`/api/user/words/${currentWord!.id}`, { difficulty })
      queryClient.invalidateQueries({ queryKey: ['saved-words'] })
      sketchboard.current?.clearCanvas()
      setReviewedWordIds(ids => [...ids, currentWord!.id])
    } catch (error) {
      console.error(error)
      alert('Could not save word review. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const canRate = isReveled || (isWordShown && isPronunciationShown && isTranslationsShown)

  return (
    <div className='mt-8 px-4 lg:px-8'>
      <div className='flex justify-between items-center mb-8 flex-wrap gap-4'>
        <h2 className='text-3xl'>
          Vocabulary Corner
        </h2>
        {reviewDue.length > 0
          ? (
            <Button
              prepend={<BookOpenCheckIcon size={18} />}
              onClick={() => setIsReviewModalOpen(true)}
            >
              Review ({reviewDue.length} due)
            </Button>
          )
          : (
            <div className="flex items-center gap-4">
              <PartyPopperIcon />
              No words to review today!
            </div>
          )
        }
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8 '>
        <div>
          <div className='flex flex-col gap-4 sticky top-4'>
            <Input
              name="vocabulary-search"
              value={q}
              onChange={setQ}
              placeholder="Search..."
              prepend={<SearchIcon size={16} />}
              noAutocoplete
            />
          </div>
        </div>
        <div className='lg:col-span-3'>
          {isPending
            ? (
              <div className="flex items-center justify-center p-24">
                <Loader big />
              </div>
            )
            : filteredSavedWords!.length === 0
              ? 'No words to show. Go listen and grabb some new words!'
              : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredSavedWords!.map(word => (
                    <li key={word.id} className={removedWordIds.includes(word.id) ? 'hidden' : ''} onClick={() => setExpandedWordId(word.id)}>
                      <Card className="overflow-visible">
                        <WordViewer
                          word={word}
                          onOptimisticRemove={() => setRemovedWordIds(r => [...r, word.id])}
                          onOptimisticRemoveFailed={() => setRemovedWordIds(r => r.filter(id => id !== word.id))}
                        />
                      </Card>
                    </li>
                  ))}
                </ul>
              )
          }
        </div>
      </div>
      <Dialog isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} className="w-[480px]">
        {currentWord
          ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                {!isWordShown && !isReveled && (
                  <button onClick={() => setIsWordShown(true)} className="text-left flex items-center gap-2 text-slate-400">
                    <EyeIcon size={16} /> Reveal word
                  </button>
                )}
                {(isWordShown || isReveled) && (
                  <div className="text-4xl font-bold">{currentWord.word}</div>
                )}
              </div>
              {currentWord.level && <div className="bg-orange-200 text-sm rounded-md px-2 self-start -mt-2 inline-block">HSK {currentWord.level}</div>}
              <div className="flex flex-col gap-2">
                {!isPronunciationShown && !isReveled && (
                  <button onClick={() => setIsPronunciationShown(true)} className="text-left flex items-center gap-2 text-slate-400">
                    <EyeIcon size={16} /> Reveal pronunciation
                  </button>
                )}
                {(isPronunciationShown || isReveled) && (
                  <div className="text-xl">{currentWord.pronunciation}</div>
                )}
              </div>
              <div className="flex flex-col gap-2">  
                {!isTranslationsShown && !isReveled && (
                  <button onClick={() => setIsTranslationsShown(v => !v)} className="text-left flex items-center gap-2 text-slate-400">
                    <EyeIcon size={16} /> Reveal translations
                  </button>
                )}
                {(isTranslationsShown || isReveled) && (
                  <ul className="flex gap-2 flex-wrap">
                    {currentWord.translations.map((sameMeaning, index) => (
                      <li key={index} className=" bg-slate-200 py-0.5 px-2 rounded-md">{sameMeaning.join('; ')}</li>
                    ))}
                  </ul>
                )}
              </div>
              {!canRate && (
                <Button
                  prepend={<Maximize2Icon size={18} />}
                  onClick={() => setIsReveled(true)}
                  className="mt-4"
                >
                  Revele
                </Button>
              )}
              {canRate && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Button onClick={() => scoreReviewHandler('easy')} isLoading={isLoading === 'easy'} disabled={!!isLoading}>Easy</Button>
                  <Button onClick={() => scoreReviewHandler('medium')} isLoading={isLoading === 'medium'} disabled={!!isLoading}>Medium</Button>
                  <Button onClick={() => scoreReviewHandler('hard')} isLoading={isLoading === 'hard'} disabled={!!isLoading}>Hard</Button>
                </div>
              )}
              <ForwardLink to={`https://tatoeba.org/en/sentences/search?from=${{ mandarin: 'cmn', spanish: 'spa', english: 'spa' }[currentWord.language]}&query=${currentWord.word}`} target="_blank">
                2Search use examples in Tatoeba
              </ForwardLink>
            </div>
          )
          : (
            <div className="flex flex-col">
              <PartyPopperIcon className="w-20 h-20" strokeWidth={1.5}  />
              <div className="font-bold text-xl mt-2 mb-2">Great job!</div>
              <p>You've completed your word reviews for today.</p>
              <p>Keep up the awesome work!</p>
            </div>
          )}
      </Dialog>
      <ReactSketchCanvas ref={sketchboard} canvasColor="#ffffffde" className={cn('fixed top-0 left-0 right-0 bottom-0 z-50', isSketchOpen ? '' : 'hidden')} style={{ border: 'none', backgroundColor: 'transparent' }} strokeWidth={4} strokeColor="black" />
      <div className="fixed bottom-8 right-8 md:bottom-12 md:right-12 flex gap-2 items-center z-50">
        {isSketchOpen && (
          <>
            <button onClick={() => sketchboard.current?.clearCanvas()} className="p-4">
              <EraserIcon />
            </button>
            <button onClick={() => sketchboard.current?.undo()} className="p-4">
              <Undo2Icon />
            </button>
          </>
        )}
        <WordDetailsModal wordId={expandedWordId} onClose={() => setExpandedWordId(null)} />
        <button onClick={() => setIsSketchOpen(v => !v)} className="bg-red-300 p-4 rounded-full border-[3px] border-black">
          {isSketchOpen ? <XIcon /> : <BrushIcon />}
        </button>
      </div>
    </div>
  )
}

export default WordCorner
