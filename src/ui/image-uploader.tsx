import { cn } from "@/utils/styles.utils";
import { XIcon } from "lucide-react";
import { MouseEventHandler, DragEvent, ChangeEvent } from "react";

interface Props {
  image: string | File | null
  onChange: (image: File | null) => void,
  className?: string,
  cannotRemove?: boolean
  rounded?: boolean
}

export const ImageUploader = ({
  image,
  rounded = false,
  cannotRemove = false,
  className,
  onChange: changeHandler
}: Props) => {
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      changeHandler(file)
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0) ?? null;
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      changeHandler(file);
    }
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement>  = event => {
    event.stopPropagation()
    event.preventDefault()
    changeHandler(null);
  };

  return (
    <label
      className={cn(
        "relative w-full aspect-square border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer p-2",
        rounded ? 'rounded-full' : 'rounded-md',
        className
      )}
      htmlFor="image-uploader"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {image && (
        <>
          {!cannotRemove && (
            <button
              onClick={handleDelete}
              className="absolute right-2 top-2 p-2 text-primary"
            >
              <XIcon/>
            </button>
          )}
          <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image!)}
            alt="Selected image"
            className={cn(
              'max-w-full max-h-full h-full w-full object-cover object-center',
              rounded ? 'rounded-full' : 'rounded-md'
            )}
          />
        </>
      )}
      {!image &&(
        <span className="text-gray-400 text-center text-sm p-4">
          Drag & drop or click to select an image
        </span>
      )}
      <input
        id="image-uploader"
        type="file"
        onChange={handleFileChange}
        accept="image/x-png,image/jpeg"
        className="hidden"
      />
    </label>
  )
}
