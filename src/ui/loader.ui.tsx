import { Loader2Icon } from "lucide-react";

interface Props {
  big?: boolean
}

export const Loader = ({ big = false }: Props) => (
  <Loader2Icon size={big ? 48 : 24} className="animate-spin text-slate-400" />
)
