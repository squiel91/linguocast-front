import { Word } from '@/types/types'
import { Card } from '@/ui/card.ui'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AudioWaveformIcon } from 'lucide-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import useRefsCollection from 'react-refs-collection'
import { ViewEmbeddedMinimized } from './minimized/view.embedded.minimized.player'
import { removePunctuation } from '@/utils/text.utils'
import { ProgressBar } from '@/ui/progress-bar.ui'

interface Props {
  transcript: string
  currentTime: number
  embedded: ReactNode
  language: string
  onTimeChangeRequest: (time: number) => void
}

export const ReadAlong = ({
  transcript: rawTimeAnnotatedTranscript,
  currentTime,
  language,
  embedded,
  onTimeChangeRequest: timeChangeRequestHandler
}: Props) => {
  const timedTranscript = useRef<({
    start: number,
    end: number,
    text: string,
    index: number
  } | null)[]>([])
  const {
    getRefHandler: getTokenRefHandler,
    getRef: getTokensRef
  } = useRefsCollection()
  const [isOutOfSync,setIsOutOfSync] = useState(false)
  const isAutomaticScroll = useRef(false)

  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const transcriptContainerElem = useRef<HTMLDivElement>(null)

  const { data: wordResults, isPending: isFetchingWord, isError: wordLookupFailed } = useQuery({
    enabled: !!selectedWord,
    queryKey: ['word', selectedWord ?? null ],
    queryFn: () => {
      if (!selectedWord) return null
      return axios.get<Word[]>(`/api/words`, { params: { q: selectedWord, language } }).then(res => res.data)
    }
  })

  const scrollToCenterChild = (child: HTMLElement) => {
    if (!child) return
  
    const parent = child.parentElement
  
    if (!parent) {
        console.error("Child element has no parent.")
        return
    }
    const containerHeight = parent.clientHeight;
      
    // Get the child's height
    const childHeight = child.offsetHeight;
    
    // Calculate the top position to center the child
    const scrollTop = child.offsetTop - (containerHeight / 2) + (childHeight / 2);
  
  // Check if the child is already centered
    const currentScrollTop = parent.scrollTop;
    const scrollTopDifference = Math.abs(currentScrollTop - scrollTop);
  
    if (scrollTopDifference < 50) return false; // No scroll needed, already centered
  
    isAutomaticScroll.current = true
    setTimeout(() => { isAutomaticScroll.current = false }, 2000)
    parent.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
    })  
  }

  // clear the word after 10 seconds
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSelectedWord(null)
    }, 10 * 1000)
    return () => clearTimeout(timeoutId)
  }, [selectedWord])

  useEffect(() => {
    timedTranscript.current = rawTimeAnnotatedTranscript
      .split('\n')
      .map((rawTimeAnnotatedWord, index) => {
        if (rawTimeAnnotatedWord.trim() === '') return null
        const [start, end, text] = rawTimeAnnotatedWord.split('\t')
        return { start: +start, end: +end, text, index }
    })
  }, [rawTimeAnnotatedTranscript])

  useEffect(() => {
    if (timedTranscript.current.length > 0 && !isOutOfSync && !isAutomaticScroll.current) {
      for (const timedToken of timedTranscript.current) {
        if (!timedToken) continue
        if (timedToken.start > currentTime) {
          const currentToken = getTokensRef(timedToken.index)
          scrollToCenterChild(currentToken)
          break
        }
      }
    }
  }, [currentTime, isOutOfSync, getTokensRef])
  
  useEffect(() => {
    if (!transcriptContainerElem.current || isOutOfSync) return
    const userScrollListener = () => {
      if (!isAutomaticScroll.current) {
        setIsOutOfSync(true)
      }
    }
    const container = transcriptContainerElem.current
    container.addEventListener('scroll', userScrollListener)
    return () => {
      container.removeEventListener('scroll', userScrollListener)
    }
  }, [transcriptContainerElem, isOutOfSync])

  return (
    <div className="read-transcript-along text-4xl md:text-5xl lg:text-6xl overflow-y-hidden relative">
      <div className="scrollbar font-bold overflow-y-auto py-16 h-full" ref={transcriptContainerElem}>
        {timedTranscript.current.map((timedToken, index) => {
          if (!timedToken) return <br key={index} />
          const { start, text } = timedToken
          return (
            <span
              key={index}
              style={{
                color: start <= currentTime ? 'brown' : 'white',
                transition: 'color .3s ease-in-out'
              }}
              className="cursor-pointer"
              ref={getTokenRefHandler(index)}
              onClick={() => {
                setSelectedWord(removePunctuation(text))
                timeChangeRequestHandler(start)
              }}
            >
              {text}
            </span>
          )
        })}
      </div>
      {isOutOfSync && (
        <button
          onClick={() => setIsOutOfSync(false)}
          className="rounded-full bg-white text-primary flex items-center gap-2 text-sm px-3 py-1 absolute left-1/2 bottom-8 z-10 -translate-x-1/2"
        >
          <AudioWaveformIcon size={16} />
          Sync
        </button>
      )}
      <div className='absolute right-0 bottom-0 z-10 text-black text-base'>
        {selectedWord
          ? isFetchingWord || wordLookupFailed || (wordResults && wordResults.length === 0)
            ? (
              <Card className="relative">
                <ProgressBar duration={10} className="absolute left-0 right-0 top-0" />
                {isFetchingWord && 'Loading word'}
                {wordLookupFailed && 'There was an error looking for the word'}
                {wordResults && wordResults.length === 0 && `Sorry! ${selectedWord} not found.`}
              </Card>
            )
            : (
              <ViewEmbeddedMinimized
                embedded={{
                  start: 0,
                  duration: 10,
                  type: 'word',
                  wordId: null,
                  word: wordResults![0]
                }}
                showCountdown
              />
            )
          : embedded}
      </div>
    </div>  
  )
}
