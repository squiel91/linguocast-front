import { resizeAndCropSquareImage } from "@/utils/files.utils"
import { cn } from "@/utils/styles.utils"
import { ImageIcon } from "lucide-react"
import { Uploader } from "./uploader.ui"
import { useState } from 'react'
import axios from 'axios'
import { Loader } from "./loader.ui"

interface Props {
  image: string | null
  uploadUrl: string
  className?: string;
  cannotRemove?: boolean
  rounded?: boolean
  disabled?: boolean
  onUploaded: (image: string | null) => void
}

export const ImageUploader = ({
  image,
  uploadUrl,
  rounded = false,
  cannotRemove = false,
  className,
  disabled,
  onUploaded: uploadedHandler
}: Props) => {
  const [isUploading, setIsUploading] = useState(false)

  const uploadImageHandler = async (originalImageFile: File | null) => {
    if (!originalImageFile) return uploadedHandler(null)

    let processedImageFile: File | null = null 
    try {
      processedImageFile = await resizeAndCropSquareImage(originalImageFile)
    } catch (error) {
      console.warn('Error resizing the image. Defaulted to the original.', error)
    }
    const formData = new FormData()
    formData.append('image', processedImageFile ?? originalImageFile)
    try {
      setIsUploading(true)
      const { data: audioUrl } = await axios.post<string>(uploadUrl, formData)
      uploadedHandler(audioUrl)
    } catch (error) {
      console.error(error)
      alert('There was an error uploading the audio! Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Uploader
      file={image}
      onChange={uploadImageHandler}
      className={className}
      cannotRemove={cannotRemove}
      rounded={rounded}
      disabled={disabled}
      type="image"
      supportedExtensions={['png', 'jpeg', 'jpg', 'gif', 'webp']}
    >
      {isUploading
        ? (
          <span className="flex w-full h-full flex-col gap-2 items-center justify-center text-gray-400 text-center text-sm p-2">
            <Loader />
            Uploading image
          </span>
        )
        : image
          ? (
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt="Selected image"
              className={cn(
                'max-w-full max-h-full h-full w-full object-cover object-center',
                rounded ? 'rounded-full' : 'rounded-md'
              )}
            />
          )
          : (
            <span className="flex w-full h-full flex-col gap-2 items-center justify-center text-gray-400 text-center text-sm p-2">
              <ImageIcon size={32} strokeWidth={1.5} />
              Drag & drop or click to upload an image
            </span>
          )
        }
    </Uploader>
  );
};
