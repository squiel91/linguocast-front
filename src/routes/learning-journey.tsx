import { BarGraph } from "@/components/bar-graph"
import { HeroContent } from "@/components/hero-content"
import { Loader } from "@/ui/loader.ui"
import { formatSeconds } from "@/utils/date.utils"
import { useTitle } from "@/utils/document.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { AudioLinesIcon, BookmarkIcon, BrainIcon, MessageSquareTextIcon, NotebookPenIcon, RssIcon, SquareCheckBigIcon } from "lucide-react"

interface DailyActivityDto {
  day: number
  added: number
  reviewed: number
}

interface LearningJourneyDto {
  savedWords: number,
  dueToReviewWords: number,
  savedPodcasts: number,
  comments: number,
  wordsWeeklyHistory: DailyActivityDto[],
  listeningTime: number,
  episodesCompleted: number,
  exercises: {
    correct: number,
    incorrectCount: number,
    total: number
  }
}

const LearningJourney = () => {
  const { data: journey } = useQuery({
    queryKey: ['user', 'journey'],
    queryFn: () => axios.get<LearningJourneyDto>('/api/user/journey').then(res => res.data)
  })

  useTitle('Learning Journey')

  if (!journey) return (
    <div className="flex items-center justify-center p-24">
      <Loader big />
    </div>
  )


  return (
    <div className="container mt-8">
      <h2 className="text-3xl mb-8">Learning Journey</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
        <div className="col-span-full h-40 flex flex-col">
          <BarGraph
            data={journey?.wordsWeeklyHistory.map(({ day, added, reviewed }) => ({ label: day, value: [added, reviewed] })) ?? []}
          />
        </div>
        <HeroContent
          hero={journey?.savedWords}
          description="Saved Words"
          icon={<BookmarkIcon size={20} />}
        />
        <HeroContent
          hero={journey?.savedPodcasts}
          description="Following Podcasts"
          icon={<RssIcon size={20} />}
        />
        <HeroContent
          hero={journey?.dueToReviewWords}
          description="Due to review"
          icon={<BrainIcon size={20} />}
        />
        <HeroContent
          hero={journey?.comments}
          description="Comments"
          icon={<MessageSquareTextIcon size={20} />}
        />
        <HeroContent
          hero={formatSeconds(journey?.listeningTime ?? 0)}
          description="Listening time"
          icon={<AudioLinesIcon size={20} />}
        />
        <HeroContent
          hero={journey?.episodesCompleted}
          description="Episodes completed"
          icon={<SquareCheckBigIcon size={20} />}
        />
        <HeroContent
          hero={`${journey?.exercises.correct}/${journey?.exercises.total}`}
          description="Correct exercises"
          icon={<NotebookPenIcon size={20} />}
        />
        
      </div>

  {/* wordsWeeklyHistory: DailyActivityDto[] */}
    </div>
  )
}

export default LearningJourney
