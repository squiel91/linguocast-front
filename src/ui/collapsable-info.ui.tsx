import { ReactNode, useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Card } from "./card.ui"

interface Props {
  top: ReactNode
  children: ReactNode
}

export const CollapsableInfo = ({ top, children }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <Card className="p-0">
      <button
        onClick={() => setIsCollapsed(v => !v)}
        className="text-left flex w-full gap-4 justify-between items-center text-xl p-4 md:p-8"
      >
        {top}
        {isCollapsed ? <PlusIcon strokeWidth={1} className="flex-shrink-0" /> : <MinusIcon strokeWidth={1} className="flex-shrink-0" />}
      </button>
      {!isCollapsed && (
        <div className="p-4 md:p-8 border-t-[1px]">{children}</div>
      )}
    </Card>
  )
}