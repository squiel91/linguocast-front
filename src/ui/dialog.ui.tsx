import { ReactNode, useEffect, useRef } from "react"
import ReactDOM from "react-dom";

interface Props {
  isOpen: boolean,
  children: ReactNode
  onClose: () => void
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
      onCancel={closeHandler}
      className="p-8 rounded-lg"
    >
      {children}
    </dialog>,
    document.getElementById('modal-container') as HTMLDivElement
  )
}

export default Dialog;