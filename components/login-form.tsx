"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as z from "zod"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./ui/field"
import { signIn } from "../lib/auth-client"
// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const { data: result, error } = await signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new Error(error.message || "Failed to sign in")
      }

      toast.success("Login successful!")

      // role comes back in the session
      const role = (result as any)?.user?.role?.toLowerCase()?.trim()
      if (role === "admin") {
        router.push("/admin")
      } else if (role === "manager") {
        router.push("/manager")
      } else {
        router.push("/reseller")
      } // resellers/fulfillers → reseller dash
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }
  // Google sign-in — wire this to the Google SVG's onClick
  const handleGoogle = () => {
    signIn.social({ provider: "google", callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback` })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-start text-start space-y-4">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-gray-500">
            Welcome! Please fill username and password to sign in into your account.          </p>
        </div>

        {/* Email */}
        <Field className="space-y-4">
          <div className="grid gap-2">
            <Input
              id="email"
              type="email"
              placeholder="Type your email"
              required
              disabled={isLoading}
              {...register("email")}
              className="
                w-full
                h-full
                px-4 py-3
                rounded-sm
                border border-[#EEEEEE]
                bg-[#EEEEEE]
                focus:outline-none
                focus:ring-2
                focus:ring-grey-500/20
                focus:border-grey-500/30
                resize-none
                font-normal
                
                placeholder:text-gray-500
                transition-all
                "
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Type your password"
              required
              disabled={isLoading}
              {...register("password")}
              className="
                      w-full
                      h-full
                      px-4 py-3
                      rounded-sm
                      border border-[#EEEEEE]
                      bg-[#EEEEEE]
                      focus:outline-none
                      focus:ring-2
                      focus:ring-grey-500/20
                      focus:border-grey-500/30
                      resize-none
                      font-normal
                      
                      placeholder:text-gray-500
                      transition-all
                      "
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <span className="sr-only">Hide password</span> : <span className="sr-only">Show password</span>}
            </Button>
            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
          </div>
        </Field>

        <Field>
          <a
            href="#"
            className="text-right text-sm underline-offset-4 hover:underline text-gray-700"
          >
            Forgot your password?
          </a>
        </Field>
        {/* Submit */}
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full rounded-full bg-[#262626] hover:bg-gray-500 p-5 text-white font-semibold transition-colors">
            {isLoading ? "Signing in..." : "Login Now"}
          </Button>
        </Field>

        {/* Social login */}
        <Field>
          <Button type="submit" onClick={handleGoogle} className="flex items-center justify-center border border-[#EEEEEE] p-5 font-semibold hover:bg-[#EEEEEE]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 533.5 544.3"
              className="h-4 w-4 mr-2"
            >
              <path
                d="M533.5 278.4c0-17.7-1.5-35.3-4.7-52.4H272v99.3h146.9c-6.3 33.7-25.1 62.4-53.6 81.7v68.1h86.7c50.6-46.6 79.5-115.3 79.5-196.7z"
                fill="#4285F4"
              />
              <path
                d="M272 544.3c72.6 0 133.6-24.1 178.1-65.5l-86.7-68.1c-24.1 16.1-55 25.5-91.4 25.5-70.3 0-129.8-47.4-151.2-111.1H33.8v69.9C77.7 482.5 169.5 544.3 272 544.3z"
                fill="#34A853"
              />
              <path
                d="M120.8 326.1c-5.7-16.9-9-34.9-9-53.1s3.3-36.2 9-53.1v-69.9H33.8C12.1 180.1 0 219.7 0 272s12.1 91.9 33.8 136.9l87-69.8z"
                fill="#FBBC05"
              />
              <path
                d="M272 107.7c39.5 0 74.8 13.6 102.7 40.3l77.1-77.1C405.6 24.7 344.6 0 272 0 169.5 0 77.7 61.8 33.8 153.3l87 69.9c21.4-63.7 80.9-111.1 151.2-111.1z"
                fill="#EA4335"
              />
            </svg>
            Login with Google
          </Button>
          {/* <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/auth/register" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription> */}
        </Field>


        {/* Separator */}
        <hr className=" border-3 border-[#EEEEEE] bg-[#EEEEEE]"></hr>

        {/* Social login */}
        <Field>
          <div className="w-full text-center text-sm text-gray-500">You can also login with</div>
          <div className="flex p-2 gap-4 items-center justify-center w-full">


            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-8 w-8 mr-2"
            >
              <path
                fill="#262626"
                d="M18.901 2H22l-6.77 7.73L23 22h-6.094l-4.77-6.23L6.68 22H3.58l7.24-8.27L1 2h6.248l4.312 5.67L18.901 2Zm-1.07 18h1.718L6.315 3.895H4.47L17.83 20Z"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className="h-8 w-8 mr-2"
            >
              <path
                fill="#262626"
                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H297V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
              />
            </svg>
          </div>



        </Field>
      </FieldGroup>
    </form>
  )
}


