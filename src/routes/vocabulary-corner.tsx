import { ReviewWordsModal } from "@/components/review-words-modal"
import { WordViewer } from "@/components/word-viewer"
import { Word } from "@/types/types"
import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { Button } from "@/ui/button.ui"
import { Card } from "@/ui/card.ui"
import { Input } from "@/ui/input.ui"
import { Loader } from "@/ui/loader.ui"
import { daySinceEpoche } from "@/utils/date.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { BrainIcon, PartyPopperIcon, SearchIcon } from "lucide-react"
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
    <>
      <Breadcrumb current="Vocabulary Corner" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Vocabulary Corner</h1>
        {reviewDue.length > 0
          ? (
          <Button
            onClick={() => setIsReviewModalOpen(true)}
            prepend={<BrainIcon size={16} />}
          >
            Review words ({reviewDue.length} due)
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
      <Input
        name="vocabulary-corner-search"
        value={q}
        onChange={setQ}
        placeholder="Search a word in your corner"
        prepend={<SearchIcon size={16} />}
        className="mb-8"
        noAutocoplete
      />
      {isPending
        ? <Loader />
        : filteredSavedWords!.length === 0
          ? 'No words yet. Go listen and catch some challenging words.'
          : (
            <ul className="grid grid-cols-4 gap-8">
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
      <ReviewWordsModal
        words={reviewDue}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onWordRevied={reviewedId => setReviewedWordIds(ids => [...ids, reviewedId])}
      />
    </>
  )
}

export default WordCorner
