import { Word } from "@/types/types"
import { HashIcon } from "lucide-react"

interface Props {
  word: Word
}

export const WordViewer = ({ word }: Props) => {
  return (
    <div className="min-w-60 max-w-md ">
      <div className="flex gap-2  mb-4 items-baseline">
        <div className="text-2xl font-bold">{word.word}</div>
        <div className="flex-grow">{word.pronunciation}</div>
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