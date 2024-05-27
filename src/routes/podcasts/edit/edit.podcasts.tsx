import { FollowLink } from '@/ui/follow-link.ui'
import { Button } from '@/ui/button.ui'
import { Checkbox } from '@/ui/checkbox.ui'
import { Input } from '@/ui/input.ui'
import { PlatformIcon } from '@/ui/platform-icon/platform-icon.ui'
import { Select } from '@/ui/select.ui'
import { EditSuccessModal } from './success-modal.edit.podcasts'
import { Textarea } from '@/ui/textarea.ui'
import { LEVELS } from '@/constants/levels.constants'
import { Language, Podcast } from '@/types/types'
import axios from 'axios'
import { AlertCircleIcon, FlagIcon, TrashIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQueries } from '@tanstack/react-query'

const SharePodcast = () => {
  const { podcastId } = useParams()

  const [
    { data: podcast },
    { data: languages }
  ] = useQueries({
    queries: [
      { queryKey: ['podcasts'], queryFn: () => axios.get<Podcast>(`/api/podcasts/${podcastId}`).then(res => res.data), enabled: podcastId ? true : false },
      { queryKey: ['languages'], queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data) }
    ]
  })

  // TODO: if !podcast send to 404
  const isEdit = !!podcast
  console.log({ podcast })

  const [name, setName] = useState<string | null>(null)
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null)
  const [mediumLanguage, setMediumLanguage] = useState('english')
  const [description, setDescription] = useState<string | null>(null)
  const [levels, setLevels] = useState<string[]>([])
  const [links, setLinks] = useState([''])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasShared, setHasShared] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!podcast) return 
    setName(podcast.name)
    setTargetLanguage(podcast.targetLanguage)
    setMediumLanguage(podcast.mediumLanguage)
    setDescription(podcast.description)
    setLevels(podcast.levels)
    setLinks(podcast.links)
    // TODO: cover image
  }, [podcast])
  useEffect(() => {
    setMediumLanguage('english')
  }, [targetLanguage])

  const MIN_DESCRIPTION_CHARS = 50
  const MAX_DESCRIPTION_CHARS = 1000

  const submitHandler = async () => {
    try {
      setErrorMessage(null)
      // validation
      if (!name) return setErrorMessage('The show name is required.')
      if (!targetLanguage) return setErrorMessage('The targer language is required.')
      if (!description || description.length < MIN_DESCRIPTION_CHARS || description.length > MAX_DESCRIPTION_CHARS) return setErrorMessage('The show description is required and need to be between 50 and 1000 characters.')
      if (levels.length === 0) return setErrorMessage('At least one level is required.')
      if (links.filter(l => !!l).length === 0) return setErrorMessage('At least one link is required.')
      
      setIsLoading(true)
      const formData = new FormData()
      if (!podcast) {
        formData.append('name', name)
        formData.append('targetLanguage', targetLanguage)
        if (mediumLanguage) formData.append('mediumLanguage', mediumLanguage)
        formData.append('description', description)
        levels.forEach(level => formData.append('levels[]', level))
        links.filter(l => !!l).forEach(link => formData.append('links[]', link))
        if (coverImage) formData.append('coverImage', coverImage);
      } else {
        if (name !== podcast.name) formData.append('Name', name)
        if (targetLanguage !== podcast.targetLanguage) formData.append('Target language', targetLanguage)
        if (mediumLanguage !== podcast.mediumLanguage) formData.append('Medium language', targetLanguage)
        if (description !== podcast.description) formData.append('Description', description)
        for (const level of LEVELS) {
          if ((levels.includes(level)) && !(podcast.levels.includes(level))) formData.append('Added levels', level)
          if ((podcast.levels.includes(level)) && !(levels.includes(level))) formData.append('Removed levels', level)
        }
        for (const link of links) {
          if (!podcast.links.includes(link)) formData.append('Added links', link)
        }
        for (const link of podcast.links) {
          if (!links.includes(link)) formData.append('Removed links', link)
        }
      }
      await axios.post(`/api/podcasts`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setHasShared(true)
    } catch (error) {
      setErrorMessage('Ooops! There was an unexpected error. Please try again or contact us.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <>
      <h1 className='text-3xl font-bold mb-8'>Share a Podcast</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-6 mb-8">
        <p className='mb-8 max-w-3xl md:col-span-2'>
          This is a directory created and mantained by the learning comunity! We encourage you to add as many language learning podcast you know and enjoy.
          Remember that only podcast mainly targeted to language learners will be accepted.
        </p>
        <div className='grid md:col-span-2 gap-6 content-start'>
          <div className="md:col-span-2">
            <Input label="Podcast name" value={name ?? ''} onChange={name => setName(name)} disabled={isLoading} />
          </div>
          <label className='flex gap-2 flex-col'>
            <div className='text-sm'>
              Target language
            </div>
            <Select
              value={targetLanguage}
              options={[
                { value: null, text: '', selectable: false },
                ...(languages?.map(({ name }) => {
                  return ({ value: name, text: name, append: <FlagIcon /> })
                }) ?? [])
              ]}
              onChange={languageCode => setTargetLanguage(languageCode)}
              disabled={isLoading}
            />
            <div className='text-xs text-slate-500 italic'>
              The primary language that is teaching.
            </div>
          </label>
          <label className='flex gap-2 flex-col'>
            <div className='text-sm'>
              Medium language
            </div>
            <Select
              value={mediumLanguage}
              options={[
                ...(languages?.map(({ name }) => ({
                  value: name,
                  text: name === targetLanguage ? `${name} (immersive)` : name,
                  append: <FlagIcon />
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
            <div className='text-sm mb-2'>Level</div>
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
            <div className='text-sm'>
              Description
            </div>
            <Textarea
              value={description ?? ''}
              onChange={value => setDescription(value)}
              disabled={isLoading}
            />
            <div className='text-xs text-slate-500 italic'>
              A brief description of the show and the most salient features about the teaching style, host personality, etc. {
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
            <div className='mb-6'>
              <label>
                <div>Cover image</div>
                <input
                  type="file"
                  onChange={event => setCoverImage(event?.target.files?.item(0) ?? null)}
                  accept="image/x-png,image/jpeg,application/pdf"
                />
              </label>
            </div>
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
                    disabled={links.length === 1 || isLoading}
                    className={links.length <= 1 ? 'opacity-30' : ''}
                  >
                    <TrashIcon size={16} className='text-primary' />
                  </button>
                </li>
              ))}
            </ul>
            <p className='text-xs text-slate-500 italic'>
              Add links where to listen and support the show: Apple, Youtube, Spotify,
              Patreon, <FollowLink to="https://en.wikipedia.org/wiki/RSS" target="_blank">RSS Feed</FollowLink>, etc.
            </p>
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
      {errorMessage && (
        <div className='rounded-md my-4 flex gap-4 items-start bg-red-100 text-red-600 p-4'>
          <AlertCircleIcon strokeWidth={1} />
          {errorMessage}
        </div>
      )}
      <div className='rounded-md text-sm flex flex-col md:flex-row gap-4 md:items-center'>
        <Button
          onClick={submitHandler}
          isLoading={isLoading}
          className='relative self-end flex-shrink-0'
          wFullInMobile
        >
          {isEdit ? 'Suggest edits' : 'Submit podcast' }
        </Button>
        <p className='text-sm'>
          By submitting you agree to the <FollowLink to="/contributions" target='_blank'>contributions terms</FollowLink>
        </p>
      </div>
      <EditSuccessModal hasShared={hasShared} isEdit={isEdit} />
    </>
  )
}

export default SharePodcast
