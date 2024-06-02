import { XIcon } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react"
import ReactDOM from "react-dom";

interface Props {
  isOpen: boolean,
  children: ReactNode
  onClose?: () => void
}

export const Dialog = ({ isOpen, onClose: closeHandler, children }: Props) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [isOpen]);

  return ReactDOM.createPortal(
    <dialog
      ref={dialog}
      onCancel={(event) => {
        event.preventDefault()
        event.stopPropagation()
        closeHandler?.()
      }}
      className="relative p-8 rounded-lg max-w-xl"
      
    >
      {closeHandler && (
        <button
          onClick={closeHandler}
          className="absolute top-4 right-4 p-2 text-primary"
        >
          <XIcon />
        </button>
      )}
      {children}
    </dialog>,
    document.getElementById('modal-container') as HTMLDivElement
  )
}

export default Dialog;