import { Word } from "@/types/types"
import { Button } from "@/ui/button.ui"
import Dialog from "@/ui/dialog.ui"
import { getRandomWholeNumber } from "@/utils/random.utils"
import axios from "axios"
import { EyeIcon, PartyPopperIcon } from "lucide-react"
import { useEffect, useState } from "react"

interface Props {
  isOpen: boolean
  onClose: () => void
  words: Word[]
  onWordRevied: (reviewedId: number) => void
}

export const ReviewWordsModal = ({
  isOpen,
  words,
  onWordRevied: wordReviedHandler,
  onClose: closeHandler
}: Props) => {
  const [isWordShown, setIsWordShown] = useState(false)
  const [isReveled, setIsReveled] = useState(false)
  const [isPronunciationShown, setIsPronunciationShown] = useState(false)
  const [isTranslationsShown, setIsTranslationsShown] = useState(false)
  const [isLoading, setIsLoading] = useState<'easy' | 'medium' | 'hard' | null>(null)
  
  const currentWord = words.at(0)

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
  }, [words])

  const scoreReviewHandler = async (difficulty: 'easy' | 'medium' | 'hard') => {
    try {
      setIsLoading(difficulty)
      await axios.patch(`/api/user/words/${currentWord!.id}`, { difficulty })
      wordReviedHandler(currentWord!.id)
    } catch (error) {
      console.error(error)
      alert('Could not save word review. Please try again.')
    } finally {
      setIsLoading(null)
    }
  }

  const canRate = isReveled || (isWordShown && isPronunciationShown && isTranslationsShown)
  return (
    <Dialog isOpen={isOpen} onClose={closeHandler}>
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
                prepend={<EyeIcon size={18} />}
                onClick={() => setIsReveled(true)}
              >
                Revele
              </Button>
            )}
            {canRate && (
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => scoreReviewHandler('easy')} isLoading={isLoading === 'easy'} disabled={!!isLoading}>Easy</Button>
                <Button onClick={() => scoreReviewHandler('medium')} isLoading={isLoading === 'medium'} disabled={!!isLoading}>Medium</Button>
                <Button onClick={() => scoreReviewHandler('hard')} isLoading={isLoading === 'hard'} disabled={!!isLoading}>Hard</Button>
              </div>
            )}
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
  )
}
