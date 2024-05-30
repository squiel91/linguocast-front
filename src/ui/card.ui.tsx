import { ReactNode } from "react"
import { cn } from "../utils/styles.utils"

interface Props {
  className?: string
  children: ReactNode
}

export const Card = ({ className, children }: Props) => (
  <div
    className={cn(
      'p-4 rounded-md drop-shadow-md bg-white',
      className
    )}
  >
    {children}
  </div>
)