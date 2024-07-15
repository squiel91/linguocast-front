import { ICompletePodcast } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Switch } from "@/ui/switch.ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { SaveIcon, TrashIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const PodcastSettings = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { podcastId: rawPodcastId } = useParams()
  const podcastId = +(rawPodcastId!)

  const [isListed, setIsListed] = useState(true)

  const { data: podcast, isPending: isLoading } = useQuery({
    queryKey: ['creators', 'podcasts', podcastId],
    queryFn: () => axios.get<ICompletePodcast>(`/api/user/podcasts/${podcastId}`).then(res => res.data)
  })

  const { mutate: mutateEpisode, isPending: isSaving } = useMutation({
    mutationKey: ['creators', 'episodes', podcast],
    mutationFn: () => axios.patch(`/api/creators/podcasts/${podcastId}`, {
      ...(isListed !== podcast?.isListed ? { isListed } : {})
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators', 'podcasts', podcastId] })
      alert('Changes saved!')
    },
    onError: (error) => {
      console.error(error)
      alert('There was an error saving the changes. Please try again!')
    }
  })

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationKey: ['creators', 'podcasts', podcast?.id ?? null],
    mutationFn: () => axios.delete(`/api/creators/podcasts/${podcastId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators', 'podcasts'] })
      queryClient.invalidateQueries({ queryKey: ['creators', 'podcasts', podcastId] })
      navigate('/creators/podcasts')
    },
    onError: (error) => {
      console.error(error)
      alert('There was an error deleting the podcast. Please try again!')
    }
  })

  useEffect(() => {
    if (!podcast) return
    setIsListed(podcast.isListed)
  }, [podcast])

  const deleteHandler = () => {
    if (confirm('Are you sure you want to delete the podcast? It will be gone forever.')) mutateDelete()
  }
  
  return (
    <>
      <h1 className='text-3xl mb-8'>Settings</h1>
      <div className="flex flex-col gap-4">
        <label className="flex gap-3 items-center">
          <Switch
            checked={isListed}
            onChange={setIsListed}
          />
          Listed
        </label>
      </div>
      <Button
        className="mt-8"
        prepend={<SaveIcon size={16} />}
        onClick={mutateEpisode}
        isLoading={isSaving}
        disabled={isLoading}
      >
        Save changes
      </Button>
      <div className="mt-8">
        <Button onClick={deleteHandler} isLoading={isDeleting} className="bg-red-400" prepend={<TrashIcon size={16} />}>
          Delete
        </Button>
      </div>
    </>
  )
}
