import { Button } from "@/ui/button.ui"
import { ImageIcon, Trash2Icon } from "lucide-react"
import { ImageEmbedded } from "../types.embededs"
import { ImageUploader } from "@/ui/image-uploader"

export interface Props {
  image: ImageEmbedded
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (embedded: (embedded: any) => any) => void
  onRemove: () => void
}

export const EditImage = ({ image: { image }, onChange: changeDispatch, onRemove }: Props) => (
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
      uploadUrl="/api/embeddeds/images"
      onUploaded={(newImageUrl => {
        changeDispatch(prevImage => ({ ...prevImage, image: newImageUrl }))
      })}
      cannotRemove
    />
  </>
)
