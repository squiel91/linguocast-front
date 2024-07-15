import { cn } from "@/utils/styles.utils";
import { ClassValue } from "clsx";
import { XIcon } from "lucide-react";
import { ReactNode, useEffect } from "react"
import ReactDOM from "react-dom";
import { Card } from "./card.ui";

interface Props {
  isOpen: boolean,
  children: ReactNode
  className?: ClassValue
  onClose?: () => void
}

export const Dialog = ({ isOpen, onClose: closeHandler, className, children }: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = 'hidden'
    } else {
      document.body.style.overflowY = 'auto'
    }
    return () => { document.body.style.overflowY = 'auto' }
  }, [isOpen])

  if (!isOpen) return <></>
  return ReactDOM.createPortal(
    (
      <>
        <div className="fixed left-0 right-0 top-0 bottom-0 bg-black opacity-25" />
        <div className="flex justify-center items-center fixed left-0 right-0 top-0 bottom-0">
          <Card
            className={cn('m-4 md:p-8 lg:p-12 max-h-screen overflow-y-auto', className)}
          >
            {children}
            {closeHandler && (
              <button
                onClick={closeHandler}
                className="absolute top-4 right-4 p-2 text-primary"
              >
                <XIcon />
              </button>
            )}
          </Card>
        </div>
      </>
    ),
    document.getElementById('modal-container') as HTMLDivElement
  )
}

export default Dialog;