import { Podcast } from '@/types/types'
import { getMainDomain, urlSafe } from '@/utils/url.utils'
import axios from 'axios'
import { ArrowUpRightIcon, CheckIcon, PenLineIcon, PlusIcon, Share2Icon } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PlatformIcon } from '@/ui/platform-icon/platform-icon.ui'
import { useAuth } from '@/auth/auth.context'
import { Button } from '@/ui/button.ui'
import { CommentViewPodcasts } from './comments.view.podcasts'
import { ListEpisodes } from './episodes.view.podcsats'
import { Breadcrumb } from '@/ui/breadcrumb.ui'
import { Card } from '@/ui/card.ui'
import { TabHeader } from '@/ui/tab-header.ui'

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
    <>
      <Breadcrumb current={podcast?.name ?? ''} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-4">
        <img
          src={`/dynamics/podcasts/covers/${podcast?.coverImage}`}
          className='w-full border-2 border-solid border-slate-300 rounded-md mb-4 aspect-square bg-cover'
        />
        <div className='col-span-1 lg:col-span-2 self-start flex flex-col justify-between'>
          <div>
            <div className='text-4xl mb-4 font-bold'>{podcast?.name}</div>
            <div className="mt-8">
              {podcast?.description.split('\n').filter(text => text).map((text, index) => (
                <p key={index} className='mb-4 break-words'>{text}</p>
              ))}
            </div>
            <div className='flex gap-2 items-end mt-4 mb-12'>
              <Button
                onClick={toggleSaveHandler}
                variant="primary"
                prepend={hasSaved ? <CheckIcon size={18} /> : <PlusIcon size={18} />}
              >
                {hasSaved ? 'Following' : 'Follow'}
              </Button>
              <Button
                variant="discrete"
                className="flex gap-2 items-center"
                prepend={<Share2Icon size={16} />}
              >
                Share
              </Button>
            </div>
            <TabHeader
              selectedKey={selectedTabKey}
              options={[
                { title: `${podcast?.episodesCount} Episodes`, key:'episodes' },
                { title: `${podcast?.commentsCount ? `{podcast?.commentsCount} ` : ''}Reviews`, key:'reviews' },
                { title: 'Info', key:'info' }
              ]}
              onChange={(key) => setSelectedTabKey(key)}
            />

            {selectedTabKey === 'episodes' && (
              <Card className='mt-4 p-0'>
                {podcast && <ListEpisodes podcastId={podcast.id} totalEpisodes={podcast.episodesCount} />}
              </Card>
            )}
            {selectedTabKey === 'reviews' && (
              <Card className='mt-4'>
                <CommentViewPodcasts podcastId={+podcastId!} />
              </Card>
            )}
            {selectedTabKey === 'info' && (
              <Card className='mt-4'>
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
                  <ul className='flex flex-wrap gap-2 items-start my-8'>
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
    </>
  )
}

export default ViewPodcast
