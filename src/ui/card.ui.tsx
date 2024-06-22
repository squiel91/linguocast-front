import { ReactNode } from "react"
import { cn } from "../utils/styles.utils"

interface Props {
  className?: string
  children: ReactNode
}

export const Card = ({ className, children }: Props) => (
  <div
    className={cn(
      'p-4 rounded-lg drop-shadow-sm bg-white border-slate-200 border-[1px] overflow-hidden',
      className
    )}
  >
    {children}
  </div>
)