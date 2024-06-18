import { Button } from "@/ui/button.ui"
import { Textarea } from "@/ui/textarea.ui"
import { SquarePenIcon, Trash2Icon } from "lucide-react"
import { Embedded, NoteEmbedded } from "../types.embededs"

export interface Props {
  note: NoteEmbedded
  onChange: (embedded: (embedded: Embedded) => Embedded) => void
  onRemove: () => void
}

export const EditNote = ({ note, onChange: changeDispatch, onRemove }: Props) => {

  const { content } = note

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="font-bold flex items-center gap-2">
          <SquarePenIcon size={14} />
          Note
        </div>
        <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
      </div>
      <Textarea
        value={content}
        onChange={(value) => changeDispatch(note => ({ ...note, content: value ?? '' }))}
        minRows={2}
      />
    </>
  )
}