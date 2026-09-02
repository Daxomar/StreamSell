import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
 
export default function VendlyLifeAvater({ loading = false }) {
  return (
    <div className={loading ? "animate-bounce inline-block" : "inline-block"}>
      <Avatar className="size-44">
        <AvatarImage src="/StreamsellLogo1.png" alt="StreamSell Logo" />
        <AvatarFallback>SS</AvatarFallback>
      </Avatar>
    </div>
  )
}