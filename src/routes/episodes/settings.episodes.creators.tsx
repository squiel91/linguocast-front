import { CreatorsEpisodeDto } from "@/types/types"
import { Button } from "@/ui/button.ui"
import { Switch } from "@/ui/switch.ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { SaveIcon, TrashIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const EpisodeSettings = () => {
  const { episodeId: rawEpisodeId, podcastId } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const episodeId = +(rawEpisodeId!)

  const [isPremium, setIsPremium] = useState(true)
  const [isListed, setIsListed] = useState(true)

  const { data: episode, isPending: isLoading } = useQuery({
    queryKey: ['creators', 'episodes', episodeId],
    queryFn: () => axios.get<CreatorsEpisodeDto>(
      `/api/creators/episodes/${episodeId}`
    ).then(res => res.data)
  })

  const { mutate: mutateEpisode, isPending: isSaving } = useMutation({
    mutationKey: ['creators', 'episodes', episodeId],
    mutationFn: () => axios.patch(`/api/creators/episodes/${episodeId}`, {
      ...(isListed !== episode?.isListed ? { isListed } : {}),
      ...(isPremium !== episode?.isPremium ? { isPremium } : {})
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators', 'episodes', episodeId] })
      alert('Changes saved!')
    },
    onError: (error) => {
      console.error(error)
      alert('There was an error saving the changes. Please try again!')
    }
  })

  const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
    mutationKey: ['creators', 'episodes', episodeId],
    mutationFn: () => axios.delete(`/api/creators/episodes/${episodeId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['creators', 'episode'] })
      queryClient.invalidateQueries({ queryKey: ['creators', 'episode', episodeId] })
      navigate(`/creators/podcasts/${podcastId}/episodes`)
    },
    onError: (error) => {
      console.error(error)
      alert('There was an error deleting the episode. Please try again!')
    }
  })

  useEffect(() => {
    if (!episode) return
    setIsListed(episode.isListed)
    setIsPremium(episode.isPremium)
  }, [episode])

  const deleteHandler = () => {
    if (confirm('Are you sure you want to delete the episode? It will be gone forever.')) mutateDelete()
  }

  return (
    <>
      <h1 className='text-3xl mb-8'>Settings</h1>
      <div className="flex flex-col gap-4">
        <label className="flex gap-3 items-center">
          <Switch
            checked={isPremium}
            onChange={setIsPremium}
          />
          Is Premium Only
        </label>
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
        <Button onClick={deleteHandler} disabled={isDeleting} className="bg-red-400" prepend={<TrashIcon size={16} />}>
          Delete
        </Button>
      </div>
    </>
  )
}
