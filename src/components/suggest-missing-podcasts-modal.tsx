import { LEVELS } from "@/constants/levels.constants"
import { Language } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Checkbox } from "@/ui/checkbox.ui"
import Dialog from "@/ui/dialog.ui"
import { Input } from "@/ui/input.ui"
import { PlatformIcon } from "@/ui/platform-icon/platform-icon.ui"
import { Select } from "@/ui/select.ui"
import { capitalize } from "@/utils/text.utils"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { HelpCircleIcon, RssIcon, TrashIcon } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

interface Props {
  isOpen: boolean
  onClose: () => void
}
export const SuggestMissingPodcastModal = ({ isOpen, onClose: closeHandler }: Props) => {
  const [name, setName] = useState<string | null>(null)
  const [targetLanguage, setTargetLanguage] = useState<string | null>(null)
  const [mediumLanguage, setMediumLanguage] = useState('english')
  const [levels, setLevels] = useState<string[]>([])
  const [rss, setRss] = useState<string | null>(null)
  const [links, setLinks] = useState([''])
  const [isSaving, setIsSaving] = useState(false)

  const { data: languages } = useQuery({
    queryKey: ['languages'],
    queryFn: () => axios.get<Language[]>('/api/languages').then(res => res.data)
  })

  const submitHandler = async () => {
    try {
      // validation
      if (!name) return alert('The show name is required.')
      if (!targetLanguage) return alert('The targer language is required.')
      if (levels.length === 0) return alert('At least one level is required.')
      if ([rss, ...links].filter(Boolean).length === 0)
        return alert('The RSS Feed or at least one link is required.')
      
      setIsSaving(true)
      const data = {
        name,
        targetLanguage,
        mediumLanguage,
        levels,
        rss,
        links: links.filter(Boolean)
      }
      await axios.post(`/api/creators/podcasts/suggestions`, data)
      alert('Thank you! We will review it')
    } catch (error) {
      alert('Ooops! There was an unexpected error. Please try again or contact us.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={closeHandler} className="w-[1024px] lg:p-12">
      <h2 className="text-3xl mb-4">Share a language learning podcast!</h2>
      <div>
        <p className='mb-1 max-w-3xl'>
          Let other learners dicover that podcast you love and help you improve your language skills.
        </p>
        <p>
          After reviewing it, we will contact the creator to join Linguocast. We'll keep you post on how the process is going.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 mb- mt-8">
        <div className='grid col-span-1 md:col-span-2 gap-4 content-start'>
          <Input className="md:col-span-2" label="Podcast name" value={name ?? ''} onChange={name => setName(name)} disabled={isSaving} />
          <label className="grid gap-1 flex-col">
            <div className="text-sm">Target language</div>
            <Select
              value={targetLanguage}
              options={
                languages?.map(({ name }) => {
                  return ({ value: name, text: capitalize(name), append: <img src={`/flags/${name}.svg`} /> })
                }) ?? []
              }
              onChange={languageCode => setTargetLanguage(languageCode)}
              disabled={isSaving}
            />
            <div className='text-xs text-slate-500 italic max-w-full'>
              The primary language that is teaching.
            </div>
          </label>
          <label className='flex gap-1 flex-col'>
            <div className='text-sm'>Medium language</div>
            <Select
              value={mediumLanguage}
              options={[
                { value: null, text: '' },
                ...(languages?.map(({ name }) => ({
                  value: name,
                  text: name === targetLanguage ? `${capitalize(name)} (immersive)` : capitalize(name),
                  append: <img src={`/flags/${name}.svg`} />
                })) ?? [])
              ]}
              onChange={languageCode => setMediumLanguage(languageCode!)}
              disabled={isSaving}
            />
            <div className='text-xs text-slate-500 italic  max-w-full'>
              Language used to provide explanations and translations.
            </div>
          </label>
          <div className='md:col-span-2'>
            <div className='text-sm mb-2'>
              <div>Level</div>
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
        <div className='flex flex-col gap-4'>
          <div>
            <Input
              label="RSS Feed"
              value={rss}
              onChange={rss => setRss(rss)}
              placeholder='https://'
              prepend={<RssIcon size={16} />}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className='text-sm'>
              <div>Links</div>
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
                    disabled={isSaving}
                  />
                  <button
                    onClick={() => setLinks(l => [...l.slice(0, index), ...l.slice(index + 1)]) }
                    disabled={links.length === 1 || isSaving}
                    className={links.length <= 1 ? 'opacity-30' : ''}
                  >
                    <TrashIcon size={16} className='text-primary' />
                  </button>
                </li>
              ))}
            </ul>
            <p className='text-xs text-slate-500 italic'>
              Add links where to listen and support the show: Apple, Youtube, Spotify,
              Patreon, etc.
            </p>
            <Button
              onClick={() => setLinks(l => [...l, ''])}
              disabled={isSaving}
              variant='outline'
              className='mt-2 px-3 py-1 self-start'
              compact
            >
              + Add link
            </Button>
          </div>
        </div>
      </div>
      <div className="flex gap-4 items-center mt-12">
        <Button
          onClick={submitHandler}
          isLoading={isSaving}
          className='relative self-end flex-shrink-0'
          wFullInMobile
        >
          Suggest podcast
        </Button>
        <div className="flex gap-2 items-center text-sm">
          <HelpCircleIcon size={18} />
          <div>
            If you are the podcast's creator you can directly <Link to="/creators" className="text-primary">create the podcast here</Link>.
          </div>
        </div>
      </div>
    </Dialog>
  )
}