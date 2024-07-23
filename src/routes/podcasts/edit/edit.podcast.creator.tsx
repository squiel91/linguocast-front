import { Button } from '@/ui/button.ui'
import { Checkbox } from '@/ui/checkbox.ui'
import { Input } from '@/ui/input.ui'
import { PlatformIcon } from '@/ui/platform-icon/platform-icon.ui'
import { Select } from '@/ui/select.ui'
import { Textarea } from '@/ui/textarea.ui'
import { LEVELS } from '@/constants/levels.constants'
import { ICompletePodcast, Language } from '@/types/types'
import axios from 'axios'
import { AlertCircleIcon, InfoIcon, LockIcon, RefreshCwIcon, RotateCcw, SaveIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'
import { ImageUploader } from '../../../ui/image-uploader'
import { capitalize } from '@/utils/text.utils'
import { ForwardLink } from '@/ui/forward-link.ui'

export const PodcastEdit = () => {
  const navigate = useNavigate()
  const { podcastId: rawPodcastId } = useParams()

  const isEdit = !!rawPodcastId
  const isCreate = !rawPodcastId

  const podcastId = rawPodcastId ? +rawPodcastId : null

  const [
    { data: podcast },
    { data: languages }
  ] = useQueries({
    queries: [
      {
        queryKey: ['creators', 'podcasts', podcastId],
        queryFn: () => axios.get<ICompletePodcast>(`/api/user/podcasts/${podcastId}`).then(res => res.data)
      },
      { queryKey: ['languages'], queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data) }
    ]
  })

  const isFromRss = !!podcast?.rss

  const [name, setName] = useState<string | null>(null)
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null)
  const [mediumLanguage, setMediumLanguage] = useState('english')
  const [description, setDescription] = useState<string | null>(null)
  const [levels, setLevels] = useState<string[]>([])
  const [links, setLinks] = useState<string[]>([])
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!podcast) return 
    setName(podcast.name)
    setTargetLanguage(podcast.targetLanguage)
    setMediumLanguage(podcast.mediumLanguage)
    setDescription(podcast.description)
    setLevels(podcast.levels ?? [])
    setLinks(podcast.links ?? [])
    setImage(podcast.image)
  }, [podcast])
  
  const MIN_DESCRIPTION_CHARS = 50
  const MAX_DESCRIPTION_CHARS = 2000
  
  const submitHandler = async () => {
    
    try {
      setErrorMessage(null)
      // validation
      if (!name) return setErrorMessage('The show name is required.')
      if (!targetLanguage) return setErrorMessage('The targer language is required.')
      if (!description || description.length < MIN_DESCRIPTION_CHARS || description.length > MAX_DESCRIPTION_CHARS) return setErrorMessage('The show description is required and need to be between 50 and 1000 characters.')
      if (levels.length === 0) return setErrorMessage('At least one level is required.')
      
      setIsLoading(true)
      if (isCreate) {
        const { data: { id: newPodcastId } } = await axios.post<{ id: number }>(`/api/creators/podcasts`, {
          name,
          targetLanguage,
          mediumLanguage,
          description,
          levels,
          image,
          links: links.filter(Boolean)
        })
        navigate(`/creators/podcasts/${newPodcastId}/episodes`)
      }
      if (isEdit) {
        const formData = new FormData()
        if (name !== podcast!.name) formData.append('Name', name)
        if (targetLanguage !== podcast!.targetLanguage) formData.append('Target language', targetLanguage)
        if (mediumLanguage !== podcast!.mediumLanguage) formData.append('Medium language', targetLanguage)
        if (description !== podcast!.description) formData.append('Description', description)
        for (const level of LEVELS) {
          if ((levels.includes(level) && !(podcast!.levels.includes(level)))) formData.append('Added levels', level)
          if (isEdit && podcast!.levels.includes(level) && !(levels.includes(level))) formData.append('Removed levels', level)
        }
        const filteredLinks = links.filter(l => !!l)
        for (const link of filteredLinks) {
          if (!podcast!.links.includes(link)) formData.append('Added links', link)
        }

        for (const link of podcast!.links) {
          if (!filteredLinks.includes(link)) formData.append('Removed links', link)
        }
        await axios.patch(`/api/creators/podcasts/${podcastId}`, {
          name,
          targetLanguage,
          mediumLanguage,
          description,
          levels,
          image,
          links: links.filter(Boolean)
        })
        alert('Changes saved!')
      }
    } catch (error) {
      setErrorMessage('Ooops! There was an unexpected error. Please try again or contact us.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4">
        <h2 className="text-3xl">Essentials</h2>
        {isEdit && podcast?.rss && (
          <Button variant="outline" prepend={<RefreshCwIcon size={20} strokeWidth={2.5} />} >RSS sync</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-6 mb-8">
        <div className='grid md:col-span-2 gap-6 content-start'>
          <Input
            label={(
              <div className='flex gap-1 items-center'>
                Podcast name
                {isFromRss && <LockIcon size={12} />}
              </div>
            )}
            value={name ?? ''}
            onChange={name => setName(name)}
            disabled={isFromRss || isLoading}
            className="md:col-span-2"
          />
          <label className='flex gap-1 flex-col'>
            <div className='text-sm'>
              Target language
            </div>
            <Select
              value={targetLanguage}
              options={[
                { value: null, text: '', selectable: false },
                ...(languages?.map(({ name }) => {
                  return ({ value: name, text: capitalize(name), append: <img src={`/flags/${name}.svg`} /> })
                }) ?? [])
              ]}
              onChange={languageCode => setTargetLanguage(languageCode)}
              disabled={isLoading}
            />
            <div className='text-xs text-slate-500 italic'>
              The primary language that you are teaching.
            </div>
          </label>
          <label className='flex gap-1 flex-col'>
            <div className='text-sm'>
              Medium language
            </div>
            <Select
              value={mediumLanguage}
              options={[
                ...(languages?.map(({ name }) => ({
                  value: name,
                  text: name === targetLanguage ? `${capitalize(name)} (immersive)` : capitalize(name),
                  append: <img src={`/flags/${name}.svg`} />
                })) ?? [])
              ]}
              onChange={languageCode => setMediumLanguage(languageCode!)}
              disabled={isLoading}
            />
            <div className='text-xs text-slate-500 italic'>
              Language used to provide explanations and translations.
            </div>
          </label>
          <div className='md:col-span-2'>
            <div className='text-sm mb-2'>
              Level
            </div>
            <div className='flex gap-x-4 gap-y-2 flex-wrap text-sm flex-col md:flex-row'>
              {LEVELS.map(level => (
                <label key={level} className='flex items-center gap-2 capitalize'>
                  <Checkbox
                    checked={levels.includes(level)}
                    onChange={checked => setLevels(levels => checked
                      ? [...levels, level]
                      : levels.filter(l => l !== level)
                    )}
                    disabled={isLoading}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>
          <label className='flex flex-col gap-2 md:col-span-2'>
            <div className='flex gap-1 items-center text-sm'>
              Podcast name
              {isFromRss && <LockIcon size={12} />}
            </div>
            <Textarea
              value={description ?? ''}
              onChange={value => setDescription(value)}
              disabled={isFromRss || isLoading}
            />
            <div className='text-xs text-slate-500 italic'>
              A brief description of the show. Comment about your teaching style and what makes it stand out. {
                !description || description?.length < MIN_DESCRIPTION_CHARS
                  ? 'At least 50 characters are required'
                  : description?.length < MAX_DESCRIPTION_CHARS
                    ? `${MAX_DESCRIPTION_CHARS - description.length} characters left`
                    : `You have ${description.length - MAX_DESCRIPTION_CHARS} over the limit`
              }.
            </div>
          </label>
        </div>
        <div className='flex flex-col gap-2'>
          <div>
            <ImageUploader
              image={image}
              uploadUrl="/api/creators/podcasts/images"
              onUploaded={setImage}
              disabled={isFromRss || isLoading}
              cannotRemove={isFromRss}
            />
            <div className='flex flex-col gap-1 mt-6'>
              <div className='text-sm'>
                Links
              </div>
              <ul className='flex gap-4 flex-col'>
                {links.map((link, index) => (
                  <li key={index} className='flex gap-4 items-center'>
                    <Input
                      prepend={
                        <PlatformIcon link={link} className="w-full h-full" />
                      }
                      className='w-full'
                      value={link || ''}
                      onChange={value => setLinks(l => [...l.slice(0, index), value ?? '', ...l.slice(index + 1)])}
                      placeholder='https://'
                      disabled={isLoading}
                    />
                    <button
                      onClick={() => setLinks(l => [...l.slice(0, index), ...l.slice(index + 1)]) }
                      disabled={isLoading}
                    >
                      <TrashIcon size={16} className='text-primary' />
                    </button>
                  </li>
                ))}
              </ul>
              <p className='text-xs text-slate-500 italic'>
                Alternative platforms to listen/support your show.
              </p>
            </div>
            <Button
              onClick={() => setLinks(l => [...l, ''])}
              disabled={isLoading}
              variant='outline'
              className='mt-4 px-3 py-1'
            >
              + Add link
            </Button>
          </div>
        </div>
      </div>
      {isCreate && (
        <div className='col-span-2 border-2 mt-8 mb-4 border-slate-200 rounded-md p-4 flex gap-4 items-center text-sm'>
          <InfoIcon size={20} className="shrink-0" />
          <div>
            By submiting I declare that this podcast is my original creation and that I accept Linguocast creators' <ForwardLink to="/creators/terms" target="_blank">terms and conditions</ForwardLink>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className='rounded-md my-4 flex gap-4 items-start bg-red-100 text-red-600 p-4'>
          <AlertCircleIcon strokeWidth={1} />
          {errorMessage}
        </div>
      )}
      <div className="mt-8 flex gap-2 items-center">
        <Button
          onClick={submitHandler}
          isLoading={isLoading}
          className='relative self-end flex-shrink-0'
          prepend={<SaveIcon size={16} />}
          wFullInMobile
        >
          {isCreate ? 'Create show' : 'Save changes'}
        </Button>
        {isEdit && (
          <Button
            onClick={() => {
              setName(podcast!.name)
              setDescription(podcast!.description)
              setTargetLanguage(podcast!.targetLanguage)
              setMediumLanguage(podcast!.mediumLanguage)
              setImage(podcast!.image)
              setLevels(podcast!.levels)
              setLinks(podcast!.links)
            }}
            prepend={<RotateCcw />}
            variant="discrete"
          >
            Discard changes
          </Button>
        )}
      </div>
    </>
  )
} 
