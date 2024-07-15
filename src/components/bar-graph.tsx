import { ReactNode } from 'react'

const COLORS = ['#FFA500', '#4CAF50', '#2196F3'] // Orange, Green, Blue

export interface BarGraphData {
  value: number | number[]
  label: ReactNode
}

interface Props {
  data: BarGraphData[]
}

export const BarGraph = ({ data }: Props) => {
  const flattenedValues = data.flatMap(item => 
    Array.isArray(item.value) ? item.value : [item.value]
  )
  const maxValue = Math.max(...flattenedValues)

  return (
    <div className="flex gap-4 flex-grow">
      {data.map(({ value, label }, index) => (
        <div key={index} className="flex flex-col justify-end grow text-center">
          <div className="flex justify-center gap-1 mb-2">
            {(Array.isArray(value) ? value : [value]).map((v, i) => (
              <div 
                key={i}
                className="w-full flex pt-1 justify-center overflow-hidden rounded-t-md self-end"
                style={{ 
                  height: `${Math.max(1, (v / maxValue) * 100)}%`,
                  backgroundColor: COLORS[i % COLORS.length]
                }}
              >
                {v}
              </div>
            ))}
          </div>
          <div className="text-sm">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}