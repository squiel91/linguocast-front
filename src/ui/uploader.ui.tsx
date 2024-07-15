import { cn } from "@/utils/styles.utils"
import { XIcon } from "lucide-react"
import { MouseEventHandler, DragEvent, ChangeEvent, ReactNode, useRef } from "react"

interface Props {
  file: string | File | null
  onChange: (file: File | null) => void
  className?: string
  cannotRemove?: boolean
  rounded?: boolean
  disabled?: boolean
  type: 'image' | 'audio'
  supportedExtensions: string[]
  children: ReactNode
}

export const Uploader = ({
  file,
  rounded = false,
  cannotRemove = false,
  className,
  disabled,
  onChange: changeHandler,
  type,
  supportedExtensions,
  children
}: Props) => {
  const inputElement = useRef<HTMLInputElement>(null)

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleFile = (file: File | null) => {
    if (!file) return
    // alert(file.type)
    if (supportedExtensions.map(extension => `${type}/${extension}`).includes(file.type)) {
      changeHandler(file)
    } else {
      console.warn('File format not supported');
      alert('File format not supported')
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    handleFile(event.dataTransfer.files.item(0))
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.item(0) ?? null)
  }

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation()
    event.preventDefault()
    changeHandler(null)
  }

  return (
    <div
      className={cn(
        "relative w-full aspect-square border-2 border-dashed border-gray-200 p-2",
        rounded ? "rounded-full" : "rounded-md",
        !disabled ? "cursor-pointer" : "",
        className
      )}
      onClick={() => {
        if (inputElement.current) {
          inputElement.current.click()
        }
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {!cannotRemove && file && (
        <button
          onClick={handleDelete}
          className="absolute right-2 top-2 p-2 text-primary"
        >
          <XIcon />
        </button>
      )}
      <input
        type="file"
        ref={inputElement}
        onChange={handleFileChange}
        accept={supportedExtensions.map(extension => `${type}/${extension}`).join(', ') }
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}