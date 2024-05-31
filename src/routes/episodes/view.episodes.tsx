import { Episode } from "@/types/types"
import { Breadcrumb } from "@/ui/breadcrumb.ui"
import { Loader } from "@/ui/loader.ui"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"

const ViewEpisode = () => {
  const { episodeId: episodeIdRaw } = useParams()
  const episodeId = +episodeIdRaw!
  const {
    data: episode,
    isLoading
  } = useQuery({
    queryKey: ['episodes', episodeId],
    queryFn: () => axios.get<Episode>(`/api/episodes/${episodeId}`).then(res => res.data)
  })

  if (isLoading || !episode) return <Loader />

  return (
    <>
      <Breadcrumb
        current="Google’s AI Gives Weird Answers & Worst Box Office Weekend in 29 Yrs"
        crumbs={[
          {
            name: 'Morning Brew Daily',
            to: 'http://localhost:3001/podcasts/30/morning-brew-daily'
          }
        ]}
      />
      <h1 className="text-4xl mb-4 font-bold">{episode.title}</h1>
      <div className="mt-8">
        {episode?.description.split('\n').filter(text => text).map((text, index) => (
          <p key={index} className='mb-4 break-words'>{text}</p>
        ))}
      </div>
    </>
  )
}

export default ViewEpisode
