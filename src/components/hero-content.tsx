import { Card } from "@/ui/card.ui"
import { ReactNode } from "react"

interface Props {
  hero: ReactNode,
  description: string
  icon: ReactNode
}

export const HeroContent = ({
  hero,
  description,
  icon
}: Props) => (
  <Card className="text-xl">
    <div className="text-5xl font-bold mb-2">{hero}</div>
    <div className="flex gap-2 items-center">
      {icon}
      {description}
    </div>
  </Card>
)
