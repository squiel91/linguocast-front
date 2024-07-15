import { Podcast } from '@/types/types'
import { getMainDomain, urlSafe } from '@/utils/url.utils'
import axios from 'axios'
import { ArrowUpRightIcon, CheckIcon, InfoIcon, LibraryIcon, MessageSquareTextIcon, PenLineIcon, PlusIcon, Share2Icon } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PlatformIcon } from '@/ui/platform-icon/platform-icon.ui'
import { useAuth } from '@/auth/auth.context'
import { Button } from '@/ui/button.ui'
import { ListComments } from '../../../ui/list.comments'
import { ListEpisodes } from './episodes.view.podcsats'
import { Breadcrumb } from '@/ui/breadcrumb.ui'
import { Card } from '@/ui/card.ui'
import SafeHtmlRenderer from '@/ui/safe-html-render.ui'
import { usePageTitle } from '@/utils/document.utils'
import { Menu } from '@/components/menu'

const ViewPodcast = () => {
  const { podcastId } = useParams()
  const { isLoggedIn, openLoginHandler } = useAuth()
  const [hasSaved, setHasSaved] = useState<boolean>(false)

  const [selectedTabKey, setSelectedTabKey] = useState('episodes')

  const { data: podcast } = useQuery({
    queryKey: ['podcasts', podcastId],
    queryFn: () => axios.get<Podcast>(`/api/podcasts/${podcastId!}`)
      .then(res => res.data)
      .then(podcasts => ({
        ...podcasts,
        savedCount: podcasts.savedCount - (podcasts.isSavedByUser ? 1 : 0)} // TODO Dont like it much
      ))
  })

  usePageTitle(podcast?.name)

  const { mutate: mutateSavePodcast } = useMutation({
    mutationFn: () => axios.post(`/api/podcasts/${podcastId!}/saves`),
    onError: () => setHasSaved(false)
  })

  const { mutate: mutateRemoveSavePodcast } = useMutation({
    mutationFn: () => axios.delete(`/api/podcasts/${podcastId!}/saves`),
    onError: () => setHasSaved(true)
  })

  useEffect(() => {
    if (podcast) setHasSaved(podcast.isSavedByUser ?? false)
  }, [podcast])

  const toggleSaveHandler = () => {
    if (!isLoggedIn) return openLoginHandler(true)
    setHasSaved(saved => {
      if (saved) mutateRemoveSavePodcast()
      else mutateSavePodcast()
      return !saved
    })
  }

  // const updatedSaveCount = (podcast?.savedCount ?? 0) + (hasSaved ? 1 : 0)
  return (
    <div className='px-4 lg:px-8'>
      <Breadcrumb crumbs={[ { to: '/explore', name: 'Explore shows'} ]} current={podcast?.name ?? ''} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4">
        <img
          src={podcast?.coverImage}
          className='w-full border-[1px] drop-shadow-sm border-solid border-slate-200 rounded-md mb-4 aspect-square bg-cover'
        />
        <div className='col-span-1 lg:col-span-2'>
          <h2 className='text-4xl mb-4'>{podcast?.name}</h2>
          <SafeHtmlRenderer
            htmlContent={podcast?.description}
            maxHeight={150}
            className="mt-4"
          />
          <div className='flex gap-2 items-end mt-8 mb-4'>
            <Button
              onClick={toggleSaveHandler}
              variant="primary"
              prepend={hasSaved ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
            >
              {hasSaved ? 'Following' : 'Follow'}
            </Button>
            <Button
              variant="outline"
              prepend={<Share2Icon size={18} />}
            >
              Share
            </Button>
          </div>
          <Menu
            underline
            className='mb-4'
            items={[
              { text: 'Episodes', icon: <LibraryIcon size={14} />, onClick: () => setSelectedTabKey('episodes'), selected: selectedTabKey === 'episodes' },
              { text: 'Reviews', icon: <MessageSquareTextIcon size={14} /> , onClick: () => setSelectedTabKey('reviews'), selected: selectedTabKey === 'reviews' },
              { text: 'Info', icon: <InfoIcon size={14} />, onClick: () => setSelectedTabKey('info'), selected: selectedTabKey === 'info' }
            ]}
          />
          {selectedTabKey === 'episodes' && podcast && (
            <ListEpisodes podcastId={podcast.id} totalEpisodes={podcast.episodesCount} />
          )}
          {selectedTabKey === 'reviews' && (
            <ListComments resourceType='podcasts' resourceId={+podcastId!} />
          )}
          {selectedTabKey === 'info' && (
            <Card>
              <table className='text-sm w-full'>
                <tbody>
                  <tr className='border-b-2 border-solid border-slate-100'>
                    <th className='uppercase text-xs text-left pr-4 text-slate-500'>Language</th>
                    <td className='capitalize'>{podcast?.targetLanguage}</td>
                  </tr>
                  <tr className='border-b-2 border-solid border-slate-100'>
                    <th className='uppercase text-xs text-left pr-4 text-slate-500'>Explanations</th>
                    <td className='capitalize'>{podcast?.mediumLanguage}</td>
                  </tr>
                  <tr className='border-b-2 border-solid border-slate-100'>
                    <th className='uppercase text-xs text-left pr-4 text-slate-500'>Levels</th>
                    <td className='capitalize'>{podcast?.levels.join(', ')}</td>
                  </tr>
                  {podcast?.since && (
                    <tr className='border-b-2 border-solid border-slate-100'>
                      <th className='uppercase text-xs text-left pr-4 text-slate-500'>First aired</th>
                      <td>{new Date(podcast?.since).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    </tr>
                  )}
                  {podcast?.episodesCount && (
                    <tr className='border-b-2 border-solid border-slate-100'>
                      <th className='uppercase text-xs text-left pr-4 text-slate-500'># Episodes</th>
                      <td>{podcast?.episodesCount}</td>
                    </tr>
                  )}
                  {(typeof podcast?.hasVideo === 'boolean') && (
                    <tr className='border-b-2 border-solid border-slate-100'>
                      <th className='uppercase text-xs text-left pr-4 text-slate-500'>Has video</th>
                      <td>{podcast?.hasVideo ? 'Yes' : 'No'}</td>
                    </tr>
                  )}
                  {(typeof podcast?.isActive === 'boolean') && (
                    <tr className='border-b-2 border-solid border-slate-100'>
                      <th className='uppercase text-xs text-left pr-4 text-slate-500'>Is Active</th>
                      <td>{podcast.isActive ? 'Yes' : 'No'}</td>
                    </tr>
                  )}
                  {typeof podcast?.transcript && (
                    <tr className='border-b-2 border-solid border-slate-100'>
                      <th className='uppercase text-xs text-left pr-4 text-slate-500'>Trasncript</th>
                      <td>{podcast?.isActive ? 'Yes' : 'No'}</td>
                    </tr>
                  )}
                </tbody>
                <ul className='flex flex-wrap gap-2 items-start mt-4'>
                  {podcast?.links?.map(link => (
                    <li key={link}>
                      <a href={link} target='_blank' title={link} className='flex bg-slate-200 font-bold px-3 py-2 rounded-full relative gap-1 items-center capitalize'>
                        <PlatformIcon link={link} className='w-4 h-4 mr-1'/>
                        {link.toLowerCase().includes('rss') ? 'RSS Feed' : getMainDomain(link)}
                        <ArrowUpRightIcon strokeWidth={1} />
                      </a>
                    </li>
                  ))}
                </ul>
              </table>
            </Card>
          )}
          <Link
            to={`/podcasts/${podcast?.id}/${urlSafe(podcast?.name)}/edit`}
            className='block mt-4'
          >
            <Button variant="discrete" prepend={<PenLineIcon size={16} />}>
              Suggest an edit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ViewPodcast
