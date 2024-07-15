import { Dialog } from "@/ui/dialog.ui"
import { CircleCheckIcon } from 'lucide-react'
import { Button } from '@/ui/button.ui'
import { Link } from 'react-router-dom'

interface Props {
  hasShared: boolean
  isEdit: boolean
}

export const EditSuccessModal = ({ hasShared, isEdit }: Props) => {
  return (
    <Dialog isOpen={hasShared}>
      <div className='text-xl mb-4 flex gap-2 items-center'>
        <CircleCheckIcon size={40} className='text-primary' />
        Thank for sharing!
      </div>
      <div className='text-base text-black mb-8'>
        Your {isEdit ? 'edition' : 'submission'} will soon be reviewed and might undergo some minor adjustments before being added to the directory. This process usually takes up to 48 hours.
      </div>
      <Link to="/">
        <Button onClick={() => console.log('Hey!')}>
          Back to the directory
        </Button>
      </Link>
    </Dialog>
  )
}
