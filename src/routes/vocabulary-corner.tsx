import { ReviewWordsModal } from "@/components/review-words-modal"
import { WordViewer } from "@/components/word-viewer"
import { Word } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { daySinceEpoche } from "@/utils/date.utils"
import { cn } from "@/utils/styles.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BookOpenCheckIcon, BrushIcon, EraserIcon, PartyPopperIcon, SearchIcon, Undo2Icon, XIcon } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas"

const WordCorner = () => {
  const [q, setQ] = useState<string | null>(null)
  const [isSketchOpen, setIsSketchOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewedWordIds, setReviewedWordIds] = useState<number[]>([])
  const [removedWordIds, setRemovedWordIds] = useState<number[]>([]) 
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

  const ReviewWordsModalMemorized = useCallback(() => (
    <ReviewWordsModal
      words={reviewDue}
      isOpen={isReviewModalOpen}
      onClose={() => setIsReviewModalOpen(false)}
      onWordRevied={(reviewedId: number) => {
        sketchboard.current?.clearCanvas()
        setReviewedWordIds(ids => [...ids, reviewedId])
      }}
    />
  ), [reviewDue, isReviewModalOpen, sketchboard])

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
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredSavedWords!.map(word => (
                    <li className={removedWordIds.includes(word.id) ? 'hidden' : ''}>
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
      <ReviewWordsModalMemorized />
      <ReactSketchCanvas ref={sketchboard} canvasColor="#ffffff90" className={cn('fixed top-0 left-0 right-0 bottom-0 z-50', isSketchOpen ? '' : 'hidden')} style={{ border: 'none', backgroundColor: 'transparent' }} strokeWidth={4} strokeColor="black" />
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
        <button onClick={() => setIsSketchOpen(v => !v)} className="bg-red-300 p-4 rounded-full border-[3px] border-black">
          {isSketchOpen ? <XIcon /> : <BrushIcon />}
        </button>
      </div>
    </div>
  )
}

export default WordCorner
