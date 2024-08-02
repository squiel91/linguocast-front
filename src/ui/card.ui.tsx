import { ReactNode } from "react"
import { cn } from "../utils/styles.utils"

interface Props {
  className?: string
  children: ReactNode
  stopPropagation?: boolean
}

export const Card = ({ className, children, stopPropagation = false }: Props) => (
  <div
    className={cn(
      'p-4 rounded-md drop-shadow-sm bg-white border-slate-200 border-[1px] overflow-hidden',
      className
    )}
    onClick={event => { if (stopPropagation) { event.preventDefault(); event.stopPropagation() }}}
  >
    {children}
  </div>
)