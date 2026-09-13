import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
 
export default function VendlyLifeAvater({ loading = false }) {
  return (
    <div className={loading ? "animate-bounce inline-block" : "inline-block"}>
      <Avatar className="size-44">
        <AvatarImage src="/streamselllogo3.jpeg" alt="StreamSell Logo" />
        <AvatarFallback>SS</AvatarFallback>
      </Avatar>
    </div>
  )
}