import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ComplaintModal } from "./ComplaintModal"

interface ComplaintBubbleProps {
  isPublic?: boolean
}

export const ComplaintBubble = ({ isPublic = true }: ComplaintBubbleProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl bg-[#262626] hover:bg-[#1a1a1a] z-50"
        title="File a complaint"
      >
        <i className="fa-solid fa-comment text-white text-lg" />
      </Button>

      <ComplaintModal open={open} onOpenChange={setOpen} isPublic={isPublic} />
    </>
  )
}