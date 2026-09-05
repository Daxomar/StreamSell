import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
 
export default function VendlyLifeAvater({ loading = false }) {
  return (
    <div className={loading ? "animate-bounce inline-block" : "inline-block"}>
      <Avatar className="size-44">
        <AvatarImage src="/stream-sell-black-exact.svg" alt="StreamSell Logo" />
        <AvatarFallback>SS</AvatarFallback>
      </Avatar>
    </div>
  )
}