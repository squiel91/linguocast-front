import { Button } from "@/ui/button.ui"
import { BookmarkIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { Embedded, WordEmbedded } from "../types.embededs"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Input } from "@/ui/input.ui"
import { useEffect } from "react"
import { useDebounce } from "@/utils/debouce.utils"
import { Loader } from "@/ui/loader.ui"

export interface Props {
  language?: string
  wordEmbedded: WordEmbedded
  onChange: (embedded: (embedded: Embedded) => Embedded) => void
  onRemove: () => void
}

export interface WordSearchResult {
  id: number
  word: string
  pronunciation: string
  translations: string[][]
}

export const EditWord = ({
  language,
  wordEmbedded,
  onChange: changeDispatch,
  onRemove
}: Props) => {
  const [q, setQ, debouncedQ] = useDebounce<string | null>(null)

  const { data: wordSearchResults, isFetching: isSearchLoading } = useQuery({
    enabled: !!language && !!debouncedQ,
    queryKey: ['words-search', language, debouncedQ],
    queryFn: () => axios.get<WordSearchResult[]>('/api/words', { params: { q: debouncedQ, language }}).then(res => res.data)
  })

  // const wordDetails = null
  const { data: wordDetails } = useQuery({
    enabled: !!language && !!wordEmbedded.wordId && !wordSearchResults,
    queryKey: ['words',  wordEmbedded.wordId],
    queryFn: () => axios.get<WordSearchResult>(`/api/words/${wordEmbedded.wordId}`).then(res => res.data)
  })

  const selectedWordSearchResult = wordSearchResults?.find(w => w.id === wordEmbedded.wordId) || wordDetails || null

  useEffect(() => {
    if (!wordSearchResults) return
    if (wordSearchResults.length === 1) changeDispatch(wordEmbedded => ({ ...wordEmbedded, wordId: wordSearchResults[0].id }))
    else changeDispatch(wordEmbedded => ({ ...wordEmbedded, wordId: null }))
  }, [wordSearchResults, changeDispatch])

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold flex items-center gap-2">
          <BookmarkIcon size={14} />
          Word
        </div>
        <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
      </div>
      <div>
        <Input
          prepend={<SearchIcon size="16" />}
          placeholder="Type a word"
          value={q}
          onChange={setQ}
          append={isSearchLoading ? <Loader /> : null}
        />
        {wordSearchResults && wordSearchResults.length > 1 && (
          <div>
            Select pronunciation:
            <ul>
              {wordSearchResults.map(result => (
                <li key={result.id}>
                  <button onClick={() => changeDispatch(wordEmbedded => ({ ...wordEmbedded, wordId: result.id }))}>
                    {result.pronunciation}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!selectedWordSearchResult && <div className="italic mt-4 text-sm">No word selected</div>}
        {selectedWordSearchResult && (
          <div className="mt-4">
            <div className="text-sm mb-2">Preview</div>
            <div>
              <div className="flex gap-2 items-baseline">
                <div className="text-2xl font-bold">{selectedWordSearchResult.word}</div>
                <div className="flex-grow">{selectedWordSearchResult.pronunciation}</div>
                <button className="bg-orange-200 rounded-full px-4 py-2 text-sm font-bold opacity-50 " disabled
                >Save emeddeds</button>
              </div>
              <ul className="mt-2 flex gap-2 flex-wrap text-sm">
                {selectedWordSearchResult.translations.map((sameMeaning, index) => (
                  <li key={index} className=" bg-slate-200 py-0.5 px-2 rounded-md">{sameMeaning.join('; ')}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
