import { cn } from "@/utils/styles.utils"
import { MicIcon, PlayIcon, PauseIcon, XIcon } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Uploader } from "./uploader.ui"
import axios from "axios"

interface Props {
  audio: string| null
  onUploaded: (audio: string | null) => void
  className?: string
  disabled?: boolean
}

export const AudioUploader = ({
  audio,
  className,
  disabled,
  onUploaded: uploadedHandler
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsPlaying(false)
    if (audio) {
      audioRef.current = new Audio(typeof audio === 'string' ? audio : URL.createObjectURL(audio))
      audioRef.current.addEventListener('ended', () => setIsPlaying(false))
      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.removeEventListener('ended', () => setIsPlaying(false))
        }
      }
    }
  }, [audio])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const uploadAudioHandler = async (audioFile: File | null) => {
    if (!audioFile) return

    const formData = new FormData()
    formData.append('audio', audioFile)
    try {
      setIsUploading(true)
      const { data: audioUrl } = await axios.post<string>('/api/episodes/audios', formData)
      uploadedHandler(audioUrl)
    } catch (error) {
      console.error(error)
      alert('There was an error uploading the audio! Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  if (isUploading) {
    return (
      'Uploading...'
    )
  }

  if (audio) {
    return (
      <div className="relative border-2 border-dashed border-gray-200 p-2 rounded-md">
        <div className="border-[1px] py-4 px-4 gap-4 border-slate-800 self-stretch rounded-md flex items-center text-slate-800 text-sm">
          <button className="text-primary" onClick={handlePlayPause}>
            {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
          </button>
          <div className="grow">Episode's audio already selected</div>
          <button className="text-primary" onClick={() => uploadedHandler(null)}>
            <XIcon />
          </button>
        </div>
      </div>
    )
  }

  return (
    <Uploader
      file={audio}
      onChange={uploadAudioHandler}
      className={cn("aspect-auto", className)}
      cannotRemove
      disabled={disabled}
      type="audio"
      supportedExtensions={['mp3', 'mpeg', 'wav', 'ogg', 'aac']}
    >
      <div className="p-2 text-center flex flex-col items-center gap-2 justify-center text-slate-400 text-sm">
        <MicIcon size={32} strokeWidth={1.5} />
        Drag & drop or click to upload the episode's audio
      </div>
    </Uploader>
  )
}