import { useEffect, useState } from 'react'

import { ChevronsUpDownIcon, GlobeIcon, MessageSquarePlusIcon, MicIcon, SearchIcon } from 'lucide-react'
import { LEVELS } from '@/constants/levels.constants'
import { Level, MinifiedPodcast } from '@/types/types'
import { Input } from '@/ui/input.ui'
import { Select } from '@/ui/select.ui'
import { cn } from '@/utils/styles.utils'
import { Checkbox } from '@/ui/checkbox.ui'
import axios from 'axios'
import { useAuth } from '@/auth/auth.context'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { PodcastSummary } from '@/ui/podcast-summary.ui'
import { PodcastSummaryPlaceholder } from '@/ui/podcast-summary-placeholder.ui'
import { SuggestMissingPodcastModal } from '@/components/suggest-missing-podcasts-modal'
import { Dropdown } from '@/ui/dropdown.ui'
import { LANGUAGES } from '@/constants/languages.constants'

const ListPodcast = () => {
  const { user } = useAuth() 

  const { data: podcasts, isFetching: podcastsIsFetching } = useQuery({
    queryKey: ['minified-podcasts'], queryFn: () => axios.get<MinifiedPodcast[]>('/api/podcasts').then(res => res.data)
  })

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);
  const [isSuggestMissingPodcastOpen, setIsSuggestMissingPodcastOpen] = useState(false)

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
    <div className='mt-8 px-4 lg:px-8'>
      <div className="flex items-center mb-8 flex-wrap gap-4">
        <h2 className='text-3xl grow'>
          Explore shows
        </h2>
        <Dropdown
          items={[
            { title: 'Suggest missing', description: 'Share a missing show so we can add it', icon: <MessageSquarePlusIcon />, onClick: () => setIsSuggestMissingPodcastOpen(true) },
            { title: 'List my own', description: 'Start a new podcast or list it from your RSS Feed', icon: <MicIcon />, to: user?.isCreator ? '/creators/podcasts/source' : '/creators'}
          ]}
        >
          Add show
        </Dropdown>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
        <div>
          <div className='flex flex-col gap-4 sticky top-4'>
            <label>
              <Select
                label="Studying"
                value={LANGUAGES.find(({ code }) => code === targetLanguage)?.code ?? null}
                options={[
                  { value: null, text: 'All languages', append: <GlobeIcon size={20} className='text-gray-400' /> },
                  ...LANGUAGES.map(({ name, code }) => {
                    return ({ value: code, text: name, append: <img src={`/flags/${code}.svg`} /> })
                  })
                ]}
                onChange={setTargetLanguage}
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
            <label className={cn(isFiltersExpanded ? 'block' : 'hidden')}>
              <Input
                value={name}
                label="Show name"
                prepend={<SearchIcon className='w-full h-full' />}
                onChange={value => setName(value)}
              />
            </label>
            <button
              onClick={() => setIsFiltersExpanded(v => !v)}
              className="text-primary flex gap-2 items-center text-sm"
            >
              <ChevronsUpDownIcon size={16} />
              {isFiltersExpanded
                ? 'Hide filters'
                : `Expand filters ${
                  appliedHiddenFiltersCount > 0
                  ? `(${appliedHiddenFiltersCount} applied)`
                  : ''}`
              }
            </button>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {podcastsIsFetching && [0, 1, 2, 3].map(i => <PodcastSummaryPlaceholder key={i} />)}
            {filtedPodcasts.length > 0
              ? (
                filtedPodcasts.map(podcast => (
                  <PodcastSummary key={podcast.id} podcast={podcast} />
                ))
              )
              : (
                <div className='text-sm text-slate-400'>There are no podcast to show</div>
              )}
          </div>
        </div>
      </div>
      <SuggestMissingPodcastModal isOpen={isSuggestMissingPodcastOpen} onClose={() => setIsSuggestMissingPodcastOpen(false)} />
    </div>
  )
}

export default ListPodcast
