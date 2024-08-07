import { Fragment } from "react/jsx-runtime";

interface Props {
  text: string
  needle: string
}

export const HighlightNeedle = ({ text, needle }: Props) => {
  const parts = text.split(needle)
  
  return (
    <p>
      <span className="font-light">...</span>
      {parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="font-black">{needle}</span>
          )}
        </Fragment>
      ))}
      <span className="font-light">...</span>
    </p>
  )
}
