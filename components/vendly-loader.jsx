import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
 
export default function VendlyLifeAvater({ loading = false }) {
  return (
    <Avatar
      className={`size-32  ${
        loading ? 'animate-bounce' : ''
      }`}
    >
      <AvatarImage
        src="/v.svg"
        alt="Vendly Life Logo"
      />
      <AvatarFallback>VL</AvatarFallback>
    </Avatar>
  )
}
 