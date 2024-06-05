interface Props {
  checked: boolean
  label?: string
  onChange: (value: boolean) => void
}

export const Switch = ({ checked, label, onChange: changeHandler }: Props) => (
  <label className="inline-flex items-center me-5 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => changeHandler(event.target.checked)}
      className="sr-only peer"
    />
    <div
      className="
        relative
        w-11
        h-6
        bg-gray-200
        rounded-full
        peer
        peer-focus:ring-2
        peer-focus:ring-red-300
        dark:peer-focus:ring-black
        peer-checked:after:translate-x-full
        rtl:peer-checked:after:-translate-x-full
        peer-checked:after:border-white
        after:content-['']
        after:absolute
        after:top-0.5
        after:start-[2px]
        after:bg-white
        after:border-gray-300
        after:border
        after:rounded-full
        after:h-5
        after:w-5
        after:transition-all
        dark:border-gray-600
        peer-checked:bg-primary
      "
    />
    {label && (
      <span className="text-sm ml-2">
        {label}
      </span>
    )}
  </label>
)
