import { useRef, useState, useEffect } from 'react'
import ReactHtmlParser, { convertNodeToElement, Transform } from 'react-html-parser'
import DOMPurify from 'dompurify'
import { ForwardLink } from './forward-link.ui'
import { Button } from './button.ui'
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

interface Props {
  htmlContent?: string
  className?: string
  maxHeight: number
}

const SafeHtmlRenderer = ({ htmlContent = '', className, maxHeight }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [needsCollapse, setNeedsCollapse] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const sanitizedHtmlContent = DOMPurify.sanitize(htmlContent)

  useEffect(() => {
    if (contentRef.current) {
      setNeedsCollapse(contentRef.current.scrollHeight > maxHeight)
    }
  }, [sanitizedHtmlContent, maxHeight])

  const transform: Transform = (node, index) => {
    if (node.type === "tag" && node.name === "a") {
      return (
        <ForwardLink key={index} to={node.attribs?.href ?? "#"} target="_blank">
          {node.children?.map((child, i) => convertNodeToElement(child, i, transform))}
        </ForwardLink>
      )
    }
  }

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className="relative"
        style={{
          maxHeight: isExpanded ? "none" : maxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease"
        }}
      >
        {ReactHtmlParser(sanitizedHtmlContent, { transform })}
        {needsCollapse && !isExpanded && <div className="gradient-overlay" />}
      </div>
      {needsCollapse && (
        <Button
          variant="discrete"
          onClick={() => setIsExpanded(!isExpanded)}
          prepend={isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16}   />}
          compact
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      )}
    </div>
  )
}

export default SafeHtmlRenderer