import { Button } from "@/ui/button.ui"
import { Link2Icon, Trash2Icon } from "lucide-react"
import { Embedded, LinkEmbedded } from "../types.embededs"
import { Input } from "@/ui/input.ui"

export interface Props {
  link: LinkEmbedded
  onChange: (embedded: (embedded: Embedded) => Embedded) => void
  onRemove: () => void
}

export const EditLink = ({ link: { url }, onChange: changeDispatch, onRemove }: Props) => (
  <>
    <div className="flex justify-between items-center">
      <div className="font-bold flex items-center gap-2">
        <Link2Icon size={14} />
        Link
      </div>
      <Button variant="discrete" onClick={onRemove} prepend={<Trash2Icon size={14} />} className="self-start" compact>Remove</Button>
    </div>
    <Input
      placeholder="https://"
      value={url}
      onChange={(value) => changeDispatch(link => ({ ...link, url: value ?? '' }))}
    />
  </>
)
