import { Word } from "@/types/types"
import Dialog from "@/ui/dialog.ui"
import { Loader } from "@/ui/loader.ui"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Dropdown } from "@/ui/dropdown.ui"
import { AudioWaveform, EllipsisVertical, HashIcon } from "lucide-react"
import tatoebaLogo from '@/assets/tatoeba.svg'
import { Card } from "@/ui/card.ui"
import { Link } from "react-router-dom"
import { urlSafe } from "@/utils/url.utils"
import { HighlightNeedle } from "@/ui/highlight-needle.ui"

interface Props {
  wordId: number | null
  onClose: () => void
}

export const WordDetailsModal = ({ wordId, onClose: closeHandler }: Props) => {
  const { data: word, isPending } = useQuery({
    queryKey: ['word', wordId ],
    queryFn: () => axios.get<Word>(`/api/words/${wordId}`).then(res => res.data)
  })

  return (
    <Dialog isOpen={!!wordId} onClose={closeHandler} className="w-[600px]">
      {isPending || !word
        ? (
          <div className="p-8 flex items-center justify-center"><Loader big /></div>
        )
        : (
          <div>
            <div className="flex gap-2 items-center overflow-visible">
              <div className="text-4xl font-bold flex-grow">{word.word}</div>
              {word.level && <div className="bg-orange-200 rounded-md px-2 inline-block mb-2">HSK {word.level}</div>}
              <Dropdown
                unformated
                items={[
                  {
                    title: 'Search examples',
                    to: `https://tatoeba.org/en/sentences/search?from=${{ mandarin: 'cmn', spanish: 'spa', english: 'spa' }[word.language]}&query=${word.word}`,
                    target: '_blank',
                    icon: <img src={tatoebaLogo} alt="Tatoeba logo" width={16} />,
                    unformated: true
                  }
                ]}
              >
                <EllipsisVertical size={18} />
              </Dropdown>
            </div>
            <div className="text-xl mt-2">{word.pronunciation}</div>
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
            {word.examples.length > 0 && (
              <>
                <div className="flex items-center my-4 gap-2 text-sm">
                  <AudioWaveform size={18} />
                  {word.examples.length} occurrence{word.examples.length === 0? '' : 's'} in episodes
                </div>
                <ul className="flex flex-col gap-4">
                  {word.examples.map(example => (
                    <li key={example.id}>
                      <Link
                        to={`/episodes/${example.episodeId}/${urlSafe(example.episodeTitle)}`}
                        target="_blank"
                      >
                        <Card>
                          <div className="text-xl mb-4">
                            <HighlightNeedle text={example.context} needle={word.word} />
                          </div>
                          <div className="flex gap-4 line-clamp-2 items-center">
                            <img className="w-12 h-12 rounded-sm object-cover border-2" src={example.episodeImage || example.podcastImage!} alt="episode cover image" />
                            <div>
                              <div className="line-clamp-1">
                                {example.episodeTitle}
                              </div>
                              <div className="line-clamp-1 text-sm">
                                {example.podcastName}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </li>  
                  ))}
                </ul>
              </>
            )}

                {/* episodeId: number
    episodeTitle: number
    episodeImage: number
    podcastName: number
    podcastImage: number
    context: string
    time: number */}
          </div>
        )}
    </Dialog>
  )
}
