import { Word } from "@/types/types"
import { Dropdown } from "@/ui/dropdown.ui"
import axios from "axios"
import { EllipsisVertical, HashIcon, TrashIcon } from "lucide-react"

interface Props {
  word: Word
  onOptimisticRemove?: () => void
  onOptimisticRemoveFailed?: () => void
}

export const WordViewer = ({ word, onOptimisticRemove, onOptimisticRemoveFailed }: Props) => {
  return (
    <div>
      <div className="flex gap-2  mb-4 items-baseline">
        <div className="text-2xl font-bold">{word.word}</div>
        <div className="flex-grow">{word.pronunciation}</div>
        <Dropdown
          unformated
          items={[
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
      <ul className="mt-2 flex gap-2 flex-wrap">
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

    </div>
  )
}