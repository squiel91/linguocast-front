import { Word } from "@/types/types"

interface Props {
  word: Word
}

export const WordViewer = ({ word }: Props) => {
  return (
    <div className="min-w-60 max-w-md ">
      <div className="flex gap-2 items-baseline">
        <div className="text-2xl font-bold">{word.word}</div>
        <div className="flex-grow">{word.pronunciation}</div>
        {/* <button
          className="bg-orange-200 ml-4 rounded-full px-4 py-2 text-sm font-bold flex gap-2 items-center"
          // onClick={() => {
          //   if (isGrabbed) removeSavedWordMutation(word.id)
          //   else saveWordMutation(word.id)
          // }}
          disabled={isGrabbedSaving}
        >
          {isGrabbed ? <GrabIcon size={16} /> : <HandIcon size={16} />}
          {isGrabbed ? 'Grabbed' : 'Grab'}
        </button> */}
      </div>
      <div className="text-sm mt-2 mb-2 text-slate-400">Translations</div>
      <ul className="mt-2 flex gap-2 flex-wrap">
        {word.translations.map((sameMeaning, index) => (
          <li key={index} className=" bg-slate-200 py-0.5 px-2 rounded-md">{sameMeaning.join('; ')}</li>
        ))}
      </ul>
      {
        word.measureWords?.length > 0 && (
          <>
            <div className="text-sm mt-2 mb-2 text-slate-400">Measure words</div>
          </>
        )
      }

    </div>
  )
}