import { CreatorsEpisodeDto } from "@/types/types"
import { AudioUploader } from "@/ui/audio-uploader.ui"
import { Button } from "@/ui/button.ui"
import { ForwardLink } from "@/ui/forward-link.ui"
import { ImageUploader } from "@/ui/image-uploader"
import { Input } from "@/ui/input.ui"
import { Textarea } from "@/ui/textarea.ui"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { InfoIcon, LockIcon, RotateCcw, SaveIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

const MIN_DESCRIPTION_CHARS = 50
const MAX_DESCRIPTION_CHARS = 1000

export const EpisodeEdit = () => {
  const navigate = useNavigate()
  const { episodeId: rawEpisodeId, podcastId } = useParams()
  const episodeId = rawEpisodeId ? +rawEpisodeId : null

  const isEdit = !!rawEpisodeId
  const isCreate = !rawEpisodeId

  const [title, setTitle] = useState<null | string>(null)
  const [description, setDescription] = useState<null | string>(null)
  const [audio, setAudio] = useState<string | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const { data: episode, isPending: isLoading } = useQuery({
    enabled: isEdit,
    queryKey: ['creators', 'episodes', episodeId],
    queryFn: () => axios.get<CreatorsEpisodeDto>(
      `/api/creators/episodes/${episodeId}`
    ).then(res => res.data)
  })

  const isFromRss = episode?.isFromRss

  useEffect(() => {
    if (!episode) return
    setTitle(episode.title)
    setDescription(episode.description)
    setImage(episode.image ?? null)
    setAudio(episode.audio)
  }, [episode])

  const saveHandler = async () => {
    try {
      setIsSaving(true)

      if (!title) return alert('The title is required.')
      if (!audio) return alert('The audio is required.')
      if (!description) return alert('The description required.')
  
      const data = {
        ...(isCreate ? { podcastId: +podcastId! } : {}),
        ...(isCreate || (title !== episode?.title) ? { title } : {}),
        ...(isCreate || (description !== episode?.description) ? { description } : {}),
        ...(isCreate || (audio !== episode?.audio) ? { audio } : {}),
        ...(isCreate || (image !== episode?.image) ? { image } : {})
      }
      if (isCreate) {
        const { data: { id:  newEpisodeId } } = await axios.post<{ id: number }>('/api/episodes', data)
        return navigate(`/creators/podcasts/${podcastId}/episodes/${newEpisodeId}/overview`)
      }
      else await axios.patch(`/api/creators/episodes/${episodeId}`, data)
      alert('Changes saved!')
    } catch (error) {
      console.error(error)
      alert('There was an error saving the episode. Please try again!')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <h1 className='text-3xl mb-8'>Essentials</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-6 mb-8">
        <div className="flex flex-col md:col-span-2 gap-6 content-start">
          <Input
            label={(
              <div className='flex gap-1 items-center'>
                Title
                {isEdit && isFromRss && <LockIcon size={12} />}
              </div>
            )}
            value={title ?? ''}
            onChange={name => setTitle(name)}
            disabled={(isEdit && isFromRss) || isSaving}
            className="w-full"
          />
          <AudioUploader audio={audio} onUploaded={setAudio} />
          <label className='flex flex-col gap-2 md:col-span-2'>
            <label className='flex flex-col gap-2 md:col-span-2'>
              <div className='flex gap-1 items-center text-sm'>
                Description
                {isEdit && isFromRss && <LockIcon size={12} />}
              </div>
              <Textarea
                value={description ?? ''}
                onChange={value => setDescription(value)}
                disabled={(isEdit && !isLoading && isFromRss) || isSaving}
              />
              <div className='text-xs text-slate-500 italic'>
                A brief description of the show. Comment about your teaching style and what makes it stand out. {
                  !description || description?.length < MIN_DESCRIPTION_CHARS
                    ? 'At least 50 characters are required'
                    : description?.length < MAX_DESCRIPTION_CHARS
                      ? `${MAX_DESCRIPTION_CHARS - description.length} characters left`
                      : `You have ${description.length - MAX_DESCRIPTION_CHARS} over the limit`
                }.
              </div>
            </label>
          </label>
        </div>
        <ImageUploader
          image={image}
          uploadUrl="/api/episodes/images"
          onUploaded={setImage}
          disabled={(isEdit && (isLoading || isFromRss)) || isSaving}
          cannotRemove={isEdit && isFromRss}
        />
      </div>
      {isCreate && (
        <div className='col-span-2 border-2 mt-8 mb-4 border-slate-200 rounded-md p-4 flex gap-4 items-center text-sm'>
          <InfoIcon size={20} className="shrink-0" />
          <div>
            By submiting I declare that this episode is my original creation and that I accept Linguocast creators' <ForwardLink to="/creators/terms" target="_blank">terms and conditions</ForwardLink>
          </div>
        </div>
      )}
      <div className="mt-8 flex gap-2 items-center">
        <Button
          prepend={<SaveIcon size={16} />}
          onClick={saveHandler}
          isLoading={isSaving}
          disabled={isEdit && isFromRss}
        >
          {isCreate ? 'Create episode' : 'Save changes'}
        </Button>
        {isEdit && (
          <Button
            onClick={() => {
              setTitle(episode!.title)
              setAudio(episode!.audio)
              setDescription(episode!.description)
              setImage(episode!.image)
            }}
            prepend={<RotateCcw />}
            variant="discrete"
          >
            Discard changes
          </Button>
        )}
      </div>
    </>
  )
}