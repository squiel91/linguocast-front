import { ReactNode } from "react"
import { cn } from "../utils/styles.utils"

interface Props {
  className: string
  children: ReactNode
}

export const Card = ({ className, children }: Props) => (
  <div
    className={cn(
      'p-4 border-2 border-slate-200 rounded-md drop-shadow-sm',
      className
    )}
  >
    {children}
  </div>
)