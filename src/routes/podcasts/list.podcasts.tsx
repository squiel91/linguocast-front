import { useEffect, useState } from 'react'

import { ChevronsUpDownIcon, GlobeIcon, LogOutIcon, PlusIcon, SearchIcon, UserPlusIcon } from 'lucide-react'
import logo from '@/assets/linguocast-logo.svg'
import { LEVELS } from '@/constants/levels.constants'
import { Footer } from '@/themes/main/footer.themes'
import { Language, Level, MinifiedPodcast } from '@/types/types'
import { FollowLink } from '@/ui/follow-link.ui'
import { Input } from '@/ui/input.ui'
import { Select } from '@/ui/select.ui'
import { cn } from '@/utils/styles.utils'
import { Checkbox } from '@/ui/checkbox.ui'
import axios from 'axios'
import { Button } from '@/ui/button.ui'
import { useAuth } from '@/auth/auth.context'
import { Link, useLocation } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { PodcastSummary } from '@/ui/podcast-summary.ui'
import { PodcastSummaryPlaceholder } from '@/ui/podcast-summary-placeholder.ui'

const ListPodcast = () => {
  const [
    { data: podcasts, isFetching: podcastsIsFetching },
    { data: languages }
  ] = useQueries({
    queries: [
      { queryKey: ['minified-podcasts'], queryFn: () => axios.get<MinifiedPodcast[]>('/api/podcasts').then(res => res.data) },
      { queryKey: ['languages'], queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data) }
    ]
  })

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);
  const { isLoggedIn, user, openRegisterHandler, openLoginHandler, logoutHandler } = useAuth()

  const [targetLanguage, setTargetLanguage] = useState(() => (searchParams.get('t') || null))
  const [name, setName] = useState(() => (searchParams.get('q') ?? null))
  const [levels, setLevels] = useState<Level[]>(() => searchParams.getAll('l') as Level[])

  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  useEffect(() => {
    const searchParams = new URLSearchParams()

    if (targetLanguage === null) searchParams.delete('t')
    else searchParams.set('t', targetLanguage)

    if (name === null) searchParams.delete('q')
    else searchParams.set('q', name)

    searchParams.delete('l')
    levels.forEach(level => searchParams.append('l', level))

    const newSearch = searchParams.toString();
    window.history.replaceState(
      {},
      '',
      location.pathname + (newSearch ? `?${searchParams}` : '')
    )
  }, [targetLanguage, name, levels])

  const filtedPodcasts = podcasts?.filter(p => (
    (!targetLanguage || p.targetLanguage === targetLanguage) &&  
    (levels.length === 0 || levels.some(l => p.levels.includes(l))) && 
    (!name || p.name.toLowerCase().includes(name.toLowerCase())) 
  )) ?? []

  const appliedHiddenFiltersCount = (name ? 1 : 0) + (levels.length > 0 ? 1 : 0) 

  return (
    <div>
      <div className='container grid lg:grid-cols-4 gap:8 lg:gap-8'>
        <div className='lg:border-r-[1px] lg:pr-8 border-slate-200 border-solid md:pb-4 lg:pb-16'>
          <div className='pt-8 lg:sticky lg:top-0 flex flex-col'>
            <div>
              <img src={logo} alt="Linguocast logo" className='w-56 mb-4' />
              <div className='mb-8'>
                The community-powered language learning podcast directory. <FollowLink to='/about'>Read more</FollowLink>
              </div>
              <div className='flex flex-col gap-4'>
                <label>
                  <div className='text-sm mb-1'>Language</div>
                  <Select
                    value={targetLanguage}
                    options={[
                      { value: null, text: 'All', append: <GlobeIcon size={20} className='text-gray-400' /> },
                      ...(
                        languages?.map(
                          ({ id, name }) => ({ value: `${id}`, text: name, append: <img src={`/flags/${name}.svg`} /> })
                      ) ?? [])
                    ]}
                    onChange={languageCode => setTargetLanguage(languageCode)}
                  />
                </label>
                <label className={cn(isFiltersExpanded ? 'block' : 'hidden', 'lg:block')}>
                  <div className='text-sm mb-1'>Level</div>
                  <div className='flex flex-col'>
                    {LEVELS.map(level => (
                      <label className='flex items-center gap-2 capitalize' key={level}>
                        <Checkbox
                          checked={levels.includes(level)}
                          onChange={checked => setLevels(levels => checked
                            ? [...levels, level]
                            : levels.filter(l => l !== level)
                          )}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </label>
                <label className={cn(isFiltersExpanded ? 'block' : 'hidden', 'lg:block')}>
                  <div className='text-sm mb-1'>Name</div>
                  <Input
                    value={name}
                    prepend={<SearchIcon className='w-full h-full' />}
                    onChange={value => setName(value)}
                  />
                </label>
                <button
                  onClick={() => setIsFiltersExpanded(v => !v)}
                  className="lg:hidden text-primary flex gap-2 items-center text-sm"
                >
                  <ChevronsUpDownIcon size={16} />
                  {isFiltersExpanded
                    ? 'Hide filters'
                    : `Show more filters ${
                      appliedHiddenFiltersCount > 0
                      ? `(${appliedHiddenFiltersCount} applied)`
                      : ''}`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='lg:col-span-3 mb-16'>
          <div className='flex justify-between col-span-full my-4 items-center'>
            <div className='hidden md:block text-sm text-stone-400 flex-shrink-0'>
              {podcastsIsFetching
                ? <div></div>
                : filtedPodcasts.length === 0
                  ? 'Oops! No podcast to show.'
                  : `Showing ${filtedPodcasts.length} podcast${filtedPodcasts.length > 1 ? 's' : ''}`
              }
            </div>
            {isLoggedIn
              ? <div className='flex gap-0 md:gap-2 w-full md:w-auto justify-end md:justify-normal items-center text-sm md:text-base'>
                Hey {user?.name}!
                <Button variant='discrete' onClick={logoutHandler}>
                  <div className='flex gap-2 items-center'>
                    <LogOutIcon size={16} />
                    Logout
                  </div>
                </Button>
              </div>
              : (
                <div className='flex w-full lg:w-auto gap-2 justify-end lg:justify-normal'>
                  <Button onClick={() => openLoginHandler(true)} variant='discrete'>
                    Login
                  </Button>
                  <Button onClick={() => openRegisterHandler(true)}>
                    <div className='flex gap-2 items-center px-2'>
                      <UserPlusIcon size={18} />Join</div>
                    </Button>
                </div>
              )
            }
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-x-6  md:gap-x-8 lg:gap-x-8 gap-y-12 lg:col-span-3'>
            {podcastsIsFetching && [0, 1, 2, 3].map(i => <PodcastSummaryPlaceholder key={i} />)}
            {filtedPodcasts.map(podcast => (
              <PodcastSummary key={podcast.id} podcast={podcast} />
            ))}
            <Link to="/podcasts/share" className="self-start text-primary">
              <div className="aspect-square flex items-center justify-center border-dashed border-2 border-primary rounded-lg flex-col">
                <PlusIcon strokeWidth={1} className="w-16 h-16" />
              </div>
              <h2 className='font-bold text-lg mt-2'>Add missing show</h2>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ListPodcast
