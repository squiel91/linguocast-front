import { CreatorsEpisodeDto, ICompletePodcast } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Loader } from "@/ui/loader.ui"
import { useQueries } from "@tanstack/react-query"
import axios from "axios"
import { Link, Outlet, useParams } from "react-router-dom"
import { BetweenHorizontalEndIcon, ChevronRightIcon, GlobeIcon, GlobeLockIcon, MicIcon, PencilLineIcon, PieChart, ScrollIcon, SettingsIcon } from "lucide-react"
import { Menu } from "@/components/menu"
import { Breadcrumb } from "@/ui/breadcrumb.ui"

export const ManageEpisode = () => {
  const { podcastId, episodeId } = useParams()

  const isCreate = !episodeId
  const isEdit = !!episodeId

  const [{ data: episode, isPending }, { data: podcast }] = useQueries({
    queries: [
      {
        enabled: isEdit,
        queryKey: ['creators', 'episodes', episodeId],
        queryFn: () => axios.get<CreatorsEpisodeDto>(
          `/api/creators/episodes/${episodeId}`
        ).then(res => res.data)
      },
      {
        enabled: isCreate,
        queryKey: ['podcasts', +podcastId!],
        queryFn: () => axios.get<ICompletePodcast>(
          `/api/user/podcasts/${+podcastId!}`
        ).then(res => res.data)
      }
    ]
  })

  if (isEdit && isPending) return <Loader />

  return (
    <div className="container">
      <Breadcrumb
        crumbs={[
          { name: 'My podcasts', to: '/creators/podcasts' },
          ...(isEdit
            ? [{ name: episode?.podcast.name ?? 'Loading...', to: `/creators/podcasts/${episode?.podcast.id}/episodes` }]
            : [{ name: podcast?.name ?? 'Loading...', to: `/creators/podcasts/${podcastId}/episodes` }])
        ]}
        current={isCreate ? 'New episode' : episode?.title ?? 'Loading...'}
      />
      {isEdit && !episode?.isListed && (
        <Link to={`/creators/podcasts/${podcastId}/episodes/${episodeId}/settings`} className="col-span-4 bg-red-200 grid grid-cols-[min-content_1fr_min-content] gap-4 border-2 border-slate-800 rounded-md items-center px-8 py-4">
          <GlobeLockIcon />
          <div>
            <h2 className="text-lg">
              The episode isn't listed yet
            </h2>
            Publish the episode in the "Settings" tab when you feel it's ready for prime time!
          </div>
          <ChevronRightIcon className="self-center" />
        </Link>
      )}
      <div className="flex items-center gap-8 justify-between mt-8 mb-4">
        <h1 className="text-4xl line-clamp-2">
          {isCreate ? 'New episode' : episode?.title}
        </h1>
        {isEdit && episode?.isListed && (
          <Link to={`/episodes/${episodeId}`} target="_blank" className="flex-shrink-0">
            <Button variant="outline" prepend={<GlobeIcon size={18} />}>View published</Button>
          </Link>
        )}
      </div>
      
      {true && (
        <Menu
          underline
          items={[
            { disabled: isCreate, text: 'Overview', icon: <PieChart size={20} />, link: `/creators/podcasts/${podcastId}/episodes/${episodeId}/overview`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes/${episodeId}/overview` )},
            { text: 'Essentials', icon: <MicIcon size={20} />, link: isCreate ? `/creators/podcasts/${podcastId}/episodes/new` : `/creators/podcasts/${podcastId}/episodes/${episodeId}/edit`, selected: isCreate || location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes/${episodeId}/edit` )},
            { disabled: isCreate, text: 'Transcript', icon: <ScrollIcon size={20} />, link: `/creators/podcasts/${podcastId}/episodes/${episodeId}/transcript`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes/${episodeId}/transcript` )},
            { disabled: isCreate, text: 'Exercises', icon: <PencilLineIcon size={20} />, link: `/creators/podcasts/${podcastId}/episodes/${episodeId}/exercises`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes/${episodeId}/exercises` )},
            { disabled: isCreate, text: 'Embeddeds', icon: <BetweenHorizontalEndIcon size={20} />, link: `/creators/podcasts/${podcastId}/episodes/${episodeId}/embeddeds`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes/${episodeId}/embeddeds`) },
            { disabled: isCreate, text: 'Settings', icon: <SettingsIcon size={20} />, link: `/creators/podcasts/${podcastId}/episodes/${episodeId}/settings`, selected: location.pathname.startsWith(`/creators/podcasts/${podcastId}/episodes/${episodeId}/settings`) }
          ]}
          className="mb-8"
        />
      )}
      <Outlet />
    </div>
  )
}