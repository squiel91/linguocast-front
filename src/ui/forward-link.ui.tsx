import { ReactNode } from 'react'
import { ArrowUpRightIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Props {
  to: string
  target?: string
  rel?: string
  children: ReactNode
}

export const ForwardLink = ({ to, target, rel, children }: Props) => (
  <Link
    to={to}
    target={target}
    className="text-primary inline-flex items-center gap-1"
    rel={rel}
  >
    {children} <ArrowUpRightIcon strokeWidth={1} className="w-5 h-5" />
  </Link>
)
