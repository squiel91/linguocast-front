import { Button } from "@/ui/button.ui"
import { ImageIcon, Trash2Icon } from "lucide-react"
import { ImageEmbedded } from "../types.embededs"
import { ImageUploader } from "@/ui/image-uploader"
import { useState } from "react"
import axios from "axios"

export interface Props {
  image: ImageEmbedded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (embedded: (embedded: any) => any) => void
  onRemove: () => void
}

export const EditImage = ({ image: { image }, onChange: changeDispatch, onRemove }: Props) => {
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'failed' | null>(null)

  const imageUploadHandler = async (image: File | null) => {
    if (image) {
      try {
        setUploadStatus('uploading')
        changeDispatch(embedded => {
          const prevImageEmbedded = embedded as ImageEmbedded
          return { ...prevImageEmbedded, image }
        })
        const formData = new FormData()
        formData.append('image', image)
        const { data: tempImageUrl } = await axios.post('/api/embeddeds/images', formData)
        changeDispatch(prevImage => ({ ...prevImage, image: tempImageUrl }))
        setUploadStatus(null)
      } catch (error) {
        console.error(error)
        alert('could not upload the picture, please try again.')
        setUploadStatus('failed')
      }
    }
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold flex items-center gap-2">
          <ImageIcon size={14} />
          Image
        </div>
        <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
      </div>
      <ImageUploader
        image={image}
        onChange={imageUploadHandler}
        cannotRemove
      />
      {uploadStatus === 'uploading' && 'Uploading...'}
      {uploadStatus === 'failed' && 'Failed. Retry'}
    </>
  )
}