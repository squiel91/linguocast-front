import { BarGraphData } from "@/components/bar-graph"
import { RawReproduction } from "@/types/types"

export const buildReproductionsData = (rawReproductions: RawReproduction[]): BarGraphData[] => {
  const today = new Date()
  const data: BarGraphData[] = []

  // Create an array of the last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const reproductions = rawReproductions.filter(item => {
      const itemDate = new Date(item.updatedAt)
      return itemDate.toDateString() === date.toDateString()
    }).length

    data.push({
      value: reproductions,
      label: `${date.getMonth() + 1}/${date.getDate()}`
    })
  }

  return data
}