import { Word } from "@/types/types"
import { Dropdown } from "@/ui/dropdown.ui"
import axios from "axios"
import { AudioWaveform, EllipsisVertical, HashIcon, TrashIcon } from "lucide-react"
import tatoebaLogo from '@/assets/tatoeba.svg'

interface Props {
  word: Word
  onOptimisticRemove?: () => void
  onOptimisticRemoveFailed?: () => void
}

export const WordViewer = ({ word, onOptimisticRemove, onOptimisticRemoveFailed }: Props) => {
  return (
    <>
      <div className="flex gap-2 items-center overflow-visible">
        <div className="text-2xl font-bold flex-grow">{word.word}</div>
        {word.level && <div className="bg-orange-200 text-sm rounded-md px-2 inline-block mb-2">HSK {word.level}</div>}
        <Dropdown
          unformated
          items={[
            {
              title: 'Search examples',
              to: `https://tatoeba.org/en/sentences/search?from=${{ mandarin: 'cmn', spanish: 'spa', english: 'spa' }[word.language]}&query=${word.word}`,
              target: '_blank',
              icon: <img src={tatoebaLogo} alt="Tatoeba logo" width={16} />,
              unformated: true
            },
            {
              title: 'Remove',
              onClick: async () => {
                try {
                  onOptimisticRemove?.()
                  await axios.delete(`/api/user/words/${word.id}`)
                } catch (error) {
                  console.error(error)
                  alert('There was an error removing the word. Please try again or contact support.')
                  onOptimisticRemoveFailed?.()
                }
              },
              icon: <TrashIcon size={16} />,
              unformated: true
            }
          ]}
        >
          <EllipsisVertical size={18} />
        </Dropdown>
      </div>
      <div>{word.pronunciation}</div>
      <ul className="mt-4 flex gap-2 flex-wrap">
        {word.translations.map((sameMeaning, index) => (
          <li key={index} className="bg-slate-100 rounded-md px-2 py-1">{sameMeaning.join('; ')}</li>
        ))}
      </ul>
      {
        word.measureWords?.length > 0 && (
          <div className="flex items-center mt-4 gap-2">
            <HashIcon size={18} />
            <ul className="flex gap-2 flex-wrap">
              {word.measureWords.map(({ id, word, pronunciation }) => (
                <li key={id} className="bg-slate-100 rounded-md px-2 py-1" title={pronunciation}>
                  {word}
                </li>
              ))}
            </ul>
          </div>
        )
      }
      {word.examplesCount > 0 && (
        <div className="flex items-center mt-4 gap-2 text-sm">
          <AudioWaveform size={18} />
          {word.examplesCount} occurrence{word.examplesCount === 0? '' : 's'}
        </div>
      )}
    </>
  )
}