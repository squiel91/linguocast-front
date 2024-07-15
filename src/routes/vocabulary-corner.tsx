import { ReviewWordsModal } from "@/components/review-words-modal"
import { WordViewer } from "@/components/word-viewer"
import { Word } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { daySinceEpoche } from "@/utils/date.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BookOpenCheckIcon, PartyPopperIcon, SearchIcon } from "lucide-react"
import { useState } from "react"

const WordCorner = () => {
  const [q, setQ] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [reviewedWordIds, setReviewedWordIds] = useState<number[]>([])
  const { data: savedWords, isPending } = useQuery({
    queryKey: ['saved-words'],
    queryFn: () => axios.get<Word[]>('/api/user/words').then(res => res.data)
  })

  const currentDay = daySinceEpoche()

  const reviewDue = savedWords?.filter(
      ({ id, reviewScheduledFor }) => ((reviewScheduledFor <= currentDay) && (!reviewedWordIds.includes(id)))
  ) ?? []

  const filteredSavedWords = q
    ? savedWords?.filter(word => (word.word.includes(q.toLowerCase()) || word.translations.flat().join('|').toLowerCase().includes(q.toLowerCase())))
    : savedWords

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
            ? <Loader />
            : filteredSavedWords!.length === 0
              ? 'No words yet. Go listen and catch some challenging words.'
              : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {filteredSavedWords!.map(word => (
                    <li>
                      <Card>
                        <WordViewer word={word} />
                      </Card>
                    </li>
                  ))}
                </ul>
              )
          }
        </div>
      </div>
      <ReviewWordsModal
        words={reviewDue}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onWordRevied={reviewedId => setReviewedWordIds(ids => [...ids, reviewedId])}
      />
    </div>
  )
}

export default WordCorner
