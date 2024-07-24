import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "../../ui/button.ui"
import linguocastLogo from '@/assets/linguocast-logo.svg' 
import linguocastCreatorsLogo from '@/assets/linguocast--creators-logo.svg' 
import { useAuth } from "../../auth/auth.context"
import { BellIcon, BookMarkedIcon, CrownIcon, DoorOpenIcon, GraduationCapIcon, HelpCircleIcon, MicIcon, NewspaperIcon, PencilIcon, PieChartIcon, TelescopeIcon } from "lucide-react"
import { Avatar } from "@/ui/avatar.ui"
import { Menu, MenuItem } from "@/components/menu"
import { cn } from "@/utils/styles.utils"
import { useQueries } from "@tanstack/react-query"
import axios from "axios"
import { Podcast, PopulatedEpisode, Word } from "@/types/types"
import { useMemo } from "react"
import { daySinceEpoche } from "@/utils/date.utils"

const MainTheme = () => {
  const {
    isLoggedIn,
    user,
    openRegisterHandler
  } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()

  const { episodeId, podcastId } = useParams()

  const [
    { data: savedWords },
    { data: podcast },
    { data: episode }
  ] = useQueries({
    queries: [
      {
        queryKey: ['saved-words'],
        queryFn: () => axios.get<Word[]>('/api/user/words').then(res => res.data)
      },
      {
        enabled: !!podcastId,
        queryKey: ['podcasts', podcastId ? +podcastId : null],
        queryFn: () => axios.get<Podcast>(`/api/podcasts/${podcastId!}`)
          .then(res => res.data)
      },
      {
        enabled: !!episodeId,
        queryKey: ['episodes', episodeId ? +episodeId : null],
        queryFn: () => axios.get<PopulatedEpisode>(`/api/episodes/${episodeId}`)
          .then(res => res.data)
      }
    ]
  })

  const reviewDueCount = useMemo(() => {
    if (!savedWords) return 0
    const currentDay = daySinceEpoche()
    return savedWords.filter(
        ({ reviewScheduledFor }) => ((reviewScheduledFor <= currentDay))
    ).length
  }, [savedWords])

  const mainMenuItems: MenuItem[] = [
    { smText: <NewspaperIcon />, text: 'Feed', link: '/feed', selected: location.pathname.startsWith('/feed') , disabled: !isLoggedIn },
    {
      smText: (
        <div className="relative">
          <BookMarkedIcon />
          {reviewDueCount > 0 && <div className="bg-primary absolute top-0 right-0 rounded-full w-2 h-2" />}
        </div>
      ),
      text: (
        <div className="flex items-start">
          Vocabulary Corner
          {reviewDueCount > 0 && <div className="bg-primary rounded-full w-2 h-2 text-white" />}
        </div>
      ),
      link: '/vocabulary',
      selected: location.pathname.startsWith('/vocabulary'),
      disabled: !isLoggedIn
    },
    { smText: <PieChartIcon />, text: 'Learning Journey', link: '/journey', selected: location.pathname.startsWith('/journey'), disabled: !isLoggedIn },
    { smText: <TelescopeIcon />, text: 'Explore Shows', link: '/explore', selected: location.pathname.startsWith('/explore') }
  ]

  const creatorMenuItems: MenuItem[] = [
    { text: 'Podcasts', link: '/creators/podcasts', selected: location.pathname.startsWith('/creators/podcasts')},
    { text: 'Earnings', link: '/creators/earnings', selected: location.pathname.startsWith('/creators/earnings') }
  ]
  

  const isCreatorsMode = location.pathname.startsWith('/creators')
  const isCreatorsLanding = location.pathname === '/creators'

  if (!isCreatorsLanding  && isCreatorsMode && (!isLoggedIn || (user && !user.isCreator))) navigate('/creators')

  return (
    <>
      {(!!user?.isAdmin || !!user?.isCreator) && !isCreatorsMode && (
        <div className="bg-slate-900 text-white">
          <div className="px-4 md:px-8 flex justify-center gap-2">
            {((podcast && podcast.creatorId === user.id) || (episode && episode.podcast.creatorId === user.id)) && (
              <Menu forCreators items={[
                ...((podcast && podcast.creatorId === user.id)
                  ? [{
                    text: 'Manage podcast',
                    link: `/creators/podcasts/${podcastId}/overview`,
                    icon: <PencilIcon size={18} />
                  }]
                  : []
                ),
                ...((episode && episode.podcast.creatorId === user.id)
                  ? [{
                    text: 'Manage episode',
                    link: `/creators/podcasts/${episode.podcast.id}/episodes/${episodeId}/overview`,
                    icon: <PencilIcon size={18} />
                  }]
                  : []
                )
              ]} />
            )}
            <Menu forCreators items={[
              {
                text: 'Creators mode',
                link: '/creators/podcasts',
                icon: <MicIcon size={18} />
              }
            ]} />
          </div>
        </div>
      )}
      <div className={cn('border-b-[1px]', isCreatorsMode ? 'border-b-slate-600' : 'border-b-slate-300')}>
        <nav className={cn('px-4 md:px-8 flex justify-between flex-wrap py-4 items-center gap-4', isCreatorsMode ? 'bg-slate-900 text-white' : 'text-slate-800')}>
          {isCreatorsMode
            ? <img src={linguocastCreatorsLogo} className='w-32 md:w-40' />
            : <img src={linguocastLogo} className='w-32 md:w-40' />}
          {isLoggedIn
            ? <div className="flex items-center gap-5">
                <BellIcon strokeWidth={2.5} className="text-slate-400" />
                <Link to={isCreatorsMode ? '/creators/help' : '/about'}>
                  <HelpCircleIcon strokeWidth={2.5} />
                </Link>
                <Link to={isCreatorsMode ? '/creators/profile' : '/profile'}>
                  <Avatar className="w-10" avatarUrl={user?.avatar} />
                </Link>
              </div>
            : (
              <Button
                compact
                variant="outline"
                prepend={<DoorOpenIcon size={18} />}
                onClick={() => openRegisterHandler(true)}
              >
                Sign-up/in
              </Button>
            )
          }
        </nav>
      </div>
      <div className={cn('sticky top-0 bg-white z-10 border-b-2 px-4 md:px-8 flex justify-between items-center w-full flex-wrap', isCreatorsMode ? 'bg-slate-900' : '')}>
        {isCreatorsMode
          ? (
            <>
              <Menu forCreators items={creatorMenuItems} />
              <Menu forCreators
                items={[
                  {
                    smText: <GraduationCapIcon />,
                    text: (
                      <div className="flex gap-2 items-center">
                        <GraduationCapIcon />
                        Learner mode
                      </div>
                    ),
                    link: '/feed'
                  }
                ]}
              />
            </>
          )
          : (
            <>
              <Menu items={mainMenuItems} />
              {!!user && !user.isPremium && (
                <Menu
                  items={[
                    {
                      smText: <CrownIcon />,
                      text: (
                        <div className="flex gap-2 items-center">
                          <CrownIcon />
                          Try Premium
                        </div>
                      ),
                      link: '/premium',
                      selected: location.pathname.startsWith('/premium')
                    }
                  ]}
                />
              )}
            </>
          )}
      </div>
      <main className='mb-24'>
        <Outlet />
      </main>
    </>
  )
}

export default MainTheme
