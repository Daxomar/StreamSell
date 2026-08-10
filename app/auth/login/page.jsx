import { ArrowLeft, GalleryVerticalEnd } from "lucide-react"
import DevModeBadge from "@/components/environmentbadge/devmodebadge"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-6">
        <div className="flex justify-between items-center md:p-4  ">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ArrowLeft size={20} />
            </div>
            <div>Back</div>
          </a>
          <a href="/auth/register" className="">
            <div>Register</div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs ">
            <div className="w-22 h-22  flex items-start justify-center ">
              <DevModeBadge />
            </div>
            <div className="hidden justify-center items-center border-2 border-black">
              <img
                src="/v.svg"
                alt="Vendly Logo"
                className="h-12 w-12 rounded-lg  object-cover"
              /></div>

            <LoginForm />
          </div>
        </div>
      </div>
<div 
  className="relative w-full h-96 lg:h-full hidden lg:flex  items-end bg-cover bg-center "
  style={{ backgroundImage: `url('https://i.pinimg.com/1200x/7d/02/38/7d0238338466de36c96038991c644409.jpg?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
>
  {/* Brand color overlay */}
  <div className="absolute inset-0 bg-[#262626]/60" />
  
  {/* Content on top */}
  <div className="relative z-10 text-white text-start p-14 mx-auto  w-full flex gap-4">
    <div className=" bg-white border-6 border-white rounded-full">
      <div className=" h-full  border-6 border-[#262626] rounded-full">
        <div className=" h-full  border-6 border-black rounded-full">
        <div className="  h-full border-6 border-white rounded-full">
        <div className="  h-full  border-6 border-[#262626] rounded-full"></div>

        </div>
        </div>
      </div>
    </div>
    <div className="">
    <h1 className="text-3xl font-bold">Welcome Back</h1>
    <p className="mt-2 text-lg">Sign in to access your dashboard and start managing your subscriptions!</p>
    </div>
    
  </div>
</div>
    </div>
  )
}
