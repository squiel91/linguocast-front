import { ChevronRightIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Fragment } from "react"

interface Props {
  current: string
  crumbs?: { name: string, to: string }[]
}

export const Breadcrumb = ({ current, crumbs = [] }: Props) => (
  <div className='mt-4 flex gap-2 md:gap-2 mb-6 items-center text-gray-400'>
    {crumbs.map(({ name, to }) => (
      <Fragment key={to}>
        <Link className="text-primary line-clamp-1" to={to}>{name}</Link>
        <ChevronRightIcon size={16} className="flex-shrink-0" />
      </Fragment>
    ))}
    <div className="line-clamp-1">{current}</div>
  </div>
)
