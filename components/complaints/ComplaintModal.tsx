import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ComplaintForm } from "./ComplaintForm"

interface ComplaintModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isPublic?: boolean
}

export const ComplaintModal = ({ open, onOpenChange, isPublic = true }: ComplaintModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="">
          <DialogTitle className="">File a Complaint</DialogTitle>
          <DialogDescription className="">
            {isPublic
              ? "Tell us about your issue and we'll look into it right away."
              : "Report an issue with a transaction or reseller."}
          </DialogDescription>
        </DialogHeader>

        <ComplaintForm
          isPublic={isPublic}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}