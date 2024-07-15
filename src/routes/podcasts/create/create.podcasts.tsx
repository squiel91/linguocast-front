import { Button } from '@/ui/button.ui'
import { Checkbox } from '@/ui/checkbox.ui'
import { Input } from '@/ui/input.ui'
import { LEVELS } from '@/constants/levels.constants'
import { Language } from '@/types/types'
import axios from 'axios'
import { CheckIcon, InfoIcon, RssIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/ui/card.ui'
import { capitalize } from '@/utils/text.utils'
import { Link, useNavigate } from 'react-router-dom'
import Dialog from '@/ui/dialog.ui'
import { Breadcrumb } from '@/ui/breadcrumb.ui'
import { Select } from '@/ui/select.ui'
import { ForwardLink } from '@/ui/forward-link.ui'

const CreatePodcast = () => {
  const navigate = useNavigate()

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data)
  })

  const [targetLanguage, setTargetLanguage] = useState<string | null>(null)
  const [mediumLanguage, setMediumLanguage] = useState('english')
  const [levels, setLevels] = useState<string[]>([])
  const [isFromRss, setIsFromRss] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [rss, setRss] = useState<string | null>(null)


  useEffect(() => {
    setMediumLanguage('english')
  }, [targetLanguage])
  
  const creteFromRssHandler = async () => {
    if (!rss) return alert('Start by pasting your RSS Feed URL.')
    if (!targetLanguage) return alert('Select the target language.')
    if (!mediumLanguage) return alert('Select the medium language.')
    if (levels.length === 0) return alert('Select at least one level.')

    setIsSaving(true)
    try {  
      const { data: { id: podcastId } } = await axios.post<{ id: number }>('/api/creators/podcasts/rss', {
        rss,
        targetLanguage,
        mediumLanguage,
        levels
      })
      navigate(`/creators/podcasts/${podcastId}/overview`)
    } catch (error) {
      console.error(error)
      alert('There was an error creating the podcast from the RSS Feed. Please revise that it is a valid RSS link and try again.\n\nIf the error persists please contact support.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='container'>
      <Breadcrumb crumbs={[{ name: 'My podcasts', to: '/creators/podcasts' }]} current="New podcast" />
      <h1 className='text-4xl mb-8'>Create a language learning podcast</h1>
      <p className='mb-8 max-w-3xl md:col-span-2 text-xl'>
        Select the option that best fit you.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <Card className="p-8 flex flex-col items-start gap-4">
          <h2 className="text-2xl">
            Start it from scratch
          </h2>
          <p>
            The smartest place to start a language learning podcast.
          </p>
          <ul className='text-sm'>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Host it at Linguocast for free.
            </li>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Add learning resouces (exercises, images, transcripts, etc.) to further engage listeners.
            </li>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Get discovered by the language learning community.
            </li>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Get an RSS Feed to add it to other podcast platforms.
            </li>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Get paid from our shared revenue pool with a 30% bonus. 
            </li>
          </ul>
          <Link to="/creators/podcasts/new">
            <Button className="mt-4">
              Get started
            </Button>
          </Link>
        </Card>
        <Card className="p-8 flex flex-col items-start gap-4">
          <h2 className="text-2xl">
            Add from existing RSS Feed
          </h2>
          <p>
            Expand your audience and tap into a new revenue stream.
          </p>
          <ul className='text-sm'>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Get discovered by the language learning community.
            </li>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Increase engagement with learning resouces (exercises, images, transcripts, etc.).
            </li>
            <li className='flex gap-2'>
              <CheckIcon size={16} className='mt-1 shrink-0' />
              Get paid from our shared revenue pool.
            </li>
          </ul>
          <Button onClick={() => setIsFromRss(true)} className='mt-4'>
            Parse RSS
          </Button>
        </Card>
        <Card className="p-8">
          <span className=' bg-slate-100 px-2 py-1 absolute top-0 left-0 right-0 text-center'>Coming soon</span>
          <div className=' flex flex-col items-start gap-4 opacity-50 mt-4'>
            <h2 className="text-2xl">
              Migrate from external RSS Feed
            </h2>
            <p>
              The smartest place to start a language learning podcast.
            </p>
            <ul className='text-sm'>
              <li className='flex gap-2'>
                <CheckIcon size={16} className='mt-1 shrink-0' />
                Host it at linguocast for free.
              </li>
              <li className='flex gap-2'>
                <CheckIcon size={16} className='mt-1 shrink-0' />
                Add learning resouces to engage listeners.
              </li>
              <li className='flex gap-2'>
                <CheckIcon size={16} className='mt-1 shrink-0' />
                Improved discoverability within the language learning community.
              </li>
              <li className='flex gap-2'>
                <CheckIcon size={16} className='mt-1 shrink-0' />
                Get an RSS Feed to add it to other podcast platforms.
              </li>
              <li className='flex gap-2'>
                <CheckIcon size={16} className='mt-1 shrink-0' />
                25% extra earnings 
              </li>
            </ul>
            <Button disabled className='mt-4'>Migrate from RSS</Button>
          </div>
        </Card>
      </div>
      <Dialog isOpen={isFromRss} className="w-[800px]">
        <h2 className="text-3xl mb-4">
          Add your show from an existing RSS Feed
        </h2>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            className="w-full col-span-2"
            value={rss}
            label="RSS feed"
            onChange={rss => setRss(rss)}
            placeholder='https://'
            prepend={<RssIcon size={16} />}
            disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
                    disabled={isSaving}
                  />
                  {level}
                </label>
              ))}
            </div>
          </div>

        </div>
        <div className='col-span-2 border-2 mt-8 border-slate-200 rounded-md p-4 flex gap-4 items-center text-sm'>
          <InfoIcon size={20} className="shrink-0" />
          <div>By submiting I declare that I own the rights to this podcast (Linguocast will verify this claim before issuing the first payout) and that I accept Linguocast creators' <ForwardLink to="/creators/terms" target="_blank">terms and conditions</ForwardLink></div>
        </div>
        <div className='flex gap-4 mt-4'>
          <Button onClick={creteFromRssHandler} isLoading={isSaving}>Add from RSS</Button>
          <Button variant="outline" onClick={() => setIsFromRss(false)} disabled={isSaving}>Cancel</Button>
        </div>
      </Dialog>
    </div>
  )
}

export default CreatePodcast
