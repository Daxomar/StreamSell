import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api } from "@/lib/api"
import toast from "react-hot-toast"
interface ComplaintFormProps {
  onSuccess?: () => void
  isPublic?: boolean
}

export const ComplaintForm = ({ onSuccess, isPublic = true }: ComplaintFormProps) => {
  const [contactType, setContactType] = useState("complaint") // "complaint" or "inquiry"
  const [transactionRef, setTransactionRef] = useState("")
  const [complaintType, setComplaintType] = useState("")
  const [description, setDescription] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: any = {
        complaintType,
        description,
      }

      // Only add transaction ref if complaint + ref provided
      if (contactType === "complaint" && transactionRef) {
        payload.transactionReference = transactionRef
      }

      if (isPublic) {
        payload.customerPhone = customerPhone
      }

      const endpoint = isPublic ? "/api/v1/complaints/public" : "/api/v1/complaints"
      return api(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      toast.success(contactType === "complaint" ? "Complaint filed" : "Inquiry sent")
      setTransactionRef("")
      setComplaintType("")
      setDescription("")
      setCustomerPhone("")
      onSuccess?.()
    },
    onError: (e: any) => {
      toast.error(e?.message || "Failed to submit")
    },
  })

  const isLoading = mutation.isPending
  const isDisabled =
    !complaintType ||
    !description ||
    (contactType === "complaint" && !transactionRef) ||
    (isPublic && !customerPhone)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        mutation.mutate()
      }}
      className="space-y-4"
    >
      <div>
        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Type</label>
        <Select value={contactType} onValueChange={setContactType}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            <SelectItem className="" value="complaint">Report a Problem</SelectItem>
            <SelectItem className="" value="inquiry">General Inquiry</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {contactType === "complaint" && (
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">
            Transaction Reference
          </label>
          <Input
            placeholder="e.g., ABC123XYZ"
            value={transactionRef}
            onChange={(e) => setTransactionRef(e.target.value)}
            className="text-sm h-9"
            required
          />
        </div>
      )}

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Category</label>
        <Select value={complaintType} onValueChange={setComplaintType}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select category..." />
          </SelectTrigger>
          <SelectContent className="">
            {contactType === "complaint" ? (
              <>
                <SelectItem className="" value="credentials_wrong">Credentials Not Working</SelectItem>
                <SelectItem className="" value="not_delivered">Not Delivered</SelectItem>
                <SelectItem className="" value="payment_issue">Payment Issue</SelectItem>
                <SelectItem className="" value="reseller_scam">Reseller Scam</SelectItem>
                <SelectItem className="" value="other">Other</SelectItem>
              </>
            ) : (
              <>
                <SelectItem className="" value="how_it_works">How It Works</SelectItem>
                <SelectItem className="" value="account_help">Account Help</SelectItem>
                <SelectItem className="" value="subscription_question">Subscription Question</SelectItem>
                <SelectItem className="" value="billing">Billing</SelectItem>
                <SelectItem className="" value="other">Other</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Message</label>
        <Textarea
          placeholder="Tell us more..."
          value={description}
          onChange={(e : React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          className="text-sm min-h-[100px] rounded-lg border-slate-200"
          required
        />
        <p className="text-xs text-slate-400 mt-1">{description.length}/1000</p>
      </div>

      {isPublic && (
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Your Phone Number</label>
          <Input
            placeholder="e.g., 0555322276"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            className="text-sm h-9"
            required
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={isDisabled || isLoading}
        className="w-full bg-[#262626] hover:bg-[#1a1a1a] text-white text-sm h-9"
      >
        {isLoading ? "Sending..." : "Send"}
      </Button>
    </form>
  )
}