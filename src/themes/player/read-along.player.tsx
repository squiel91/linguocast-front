import { useQuery } from '@tanstack/react-query'
import { AudioWaveformIcon } from 'lucide-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import useRefsCollection from 'react-refs-collection'

interface Props {
  transcript: string
  currentTime: number
  embedded: ReactNode
  onTimeChangeRequest: (time: number) => void
}



export const ReadAlong = ({
  transcript: rawTimeAnnotatedTranscript,
  currentTime,
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

  useQuery
  // const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const transcriptContainerElem = useRef<HTMLDivElement>(null)

  const scrollToCenterChild = (child: HTMLElement) => {
    console.log('scrollToCenterChild called')
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
  
    console.log({scrollTopDifference})
  
    if (scrollTopDifference < 50) return false; // No scroll needed, already centered
  
    isAutomaticScroll.current = true
    setTimeout(() => { isAutomaticScroll.current = false }, 2000)
    parent.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
    })  
  }

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
              onClick={() => timeChangeRequestHandler(start)}
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
        {embedded}
      </div>
    </div>  
  )
}
