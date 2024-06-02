import { cn } from "@/utils/styles.utils"

interface Props<T> {
  selectedKey: string
  options: { title: string, key: T }[]
  onChange: (key: T) => void
}

export const TabHeader = <T extends string>({ selectedKey, options, onChange: changeHandler }: Props<T>) => (
  <div className="bg-slate-100 p-1 rounded-lg inline-flex text-slate-600">
    {options.map(({ title, key }) => (
      <button
        key={key}
        className={cn(
          'px-4 py-1',
          selectedKey === key ? 'bg-white  rounded-lg text-black drop-shadow-sm' : ''  
        )}
        onClick={() => changeHandler(key)}
      >
        {title}
      </button>
    ))}
  </div>
)