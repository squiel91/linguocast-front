import { ICompletePodcast } from '@/types/types'
import axios from 'axios'
import { ChevronRightIcon, GlobeIcon, GlobeLockIcon, LibraryIcon, PencilIcon, PieChart, Settings } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb } from '@/ui/breadcrumb.ui'
import { Menu } from '@/components/menu'
import { useAuth } from '@/auth/auth.context'
import { Button } from '@/ui/button.ui'

const EditPodcast = () => {
  const { isLoggedIn } = useAuth()

  const location = useLocation()
  const navigate = useNavigate()

  if (!isLoggedIn) navigate('/creators')

  const { podcastId: rawPodcastId } = useParams()

  const isEdit = !!rawPodcastId
  const isCreate = !rawPodcastId

  const podcastId = rawPodcastId ? +rawPodcastId : null

  const { data: podcast } = useQuery({
    enabled: isEdit,
    queryKey: ['creators', 'podcasts', podcastId],
    queryFn: () => axios.get<ICompletePodcast>(`/api/user/podcasts/${podcastId}`).then(res => res.data)
  })

  return (
    <div className='container'>
      <Breadcrumb
        crumbs={[{ name: 'My podcasts', to: '/creators/podcasts' }]}
        current={isCreate ? 'New podcast' : (podcast?.name ?? 'Loading...')}
      />
      {isEdit && !podcast?.isListed && (
        <Link to={`/creators/podcasts/${podcastId}/settings`} className="col-span-4 mb-8 bg-red-200 grid grid-cols-[min-content_1fr_min-content] gap-4 border-2 border-slate-800 rounded-md items-center px-8 py-4">
          <GlobeLockIcon />
          <div>
            <h2 className="text-lg">
              The podcast isn't listed yet
            </h2>
            Publish the podcast in the "Settings" tab when you feel it's ready for prime time!
          </div>
          <ChevronRightIcon className="self-center" />
        </Link>
      )}
      <div className="flex items-center gap-8 justify-between mt-8 mb-4">
        <h1 className="text-4xl line-clamp-2">
          {isCreate ? 'Start a new podcast' : podcast?.name}
        </h1>
        {isEdit && podcast?.isListed && (
          <Link to={`/podcasts/${podcast.id}`} target="_blank" className="flex-shrink-0">
            <Button variant="outline" prepend={<GlobeIcon size={18} />}>View published</Button>
          </Link>
        )}
      </div>
      <Menu
        underline
        items={[
          { disabled: isCreate, text: 'Overview', icon: <PieChart size={20} />, link: `/creators/podcasts/${podcastId}/overview`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/overview` )},
          { text: 'Essentials', icon: <PencilIcon size={20} />, link: `/creators/podcasts/${podcastId}/edit`, selected: isCreate || location.pathname.startsWith(`/creators/podcasts/${podcastId}/edit` )},
          { disabled: isCreate, text: 'Episodes', icon: <LibraryIcon size={20} />, link: `/creators/podcasts/${podcastId}/episodes`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes` )},
          { disabled: isCreate, text: 'Settings', icon: <Settings size={20} />, link: `/creators/podcasts/${podcastId}/settings`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/settings`) }
        ]}
        className="mb-8"
      />
      <Outlet />
    </div>
  )
}

export default EditPodcast
