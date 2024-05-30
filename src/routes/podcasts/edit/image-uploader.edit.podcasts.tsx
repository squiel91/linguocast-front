import { XIcon } from "lucide-react";
import { MouseEventHandler, DragEvent, ChangeEvent } from "react";

interface Props {
  image: string | File | null
  onChange: (image: File | null) => void
}

export const ImageUploader = ({ image, onChange: changeHandler }: Props) => {
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
    <div>
      <div className="mb-2 text-sm">Cover image</div>
      <label
        className="relative w-full aspect-square border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center cursor-pointer p-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {image && (
          <>
            <button
              onClick={handleDelete}
              className="absolute right-2 top-2 p-2 text-primary"
            >
              <XIcon/>
            </button>
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image!)}
              alt="Selected image"
              className="max-w-full max-h-full h-full w-full object-cover rounded-sm"
            />
          </>
        )}
        {!image &&(
          <span className="text-gray-400 text-center text-sm p-4">
            Drag & drop or click to select an image
          </span>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/x-png,image/jpeg"
          className="hidden"
        />
      </label>
    </div>
  );
};