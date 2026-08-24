"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldGroup,
} from "@/components/ui/field"
import { Loader2, CheckCircle, ArrowLeft, CheckCheck } from "lucide-react"
import toast from 'react-hot-toast'
import Link from "next/link"

const registerSchema = z
  .object({
    businessName: z.string().min(2, "Business name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .regex(/^0[2-9]\d{8}$/, "Enter a valid phone number (e.g. 0241234567)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export default function VendorRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/vendor/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
        body: JSON.stringify({
          businessName: data.businessName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to sign up")
      }

      if (result?.user) {
        toast.success("Registration successful!")
        await new Promise((resolve) => setTimeout(resolve, 500))
        setIsSuccess(true)
      } else {
        throw new Error("No user data returned from server")
      }

    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error.message || "Failed to register as vendor.")
    } finally {
      setIsLoading(false)
    }
  }


  const handleGoogle = () => {
    signIn.social({ provider: "google", callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback` })
  }

  if (isSuccess) {
    return (
      <div className="grid min-h-svh lg:grid-cols-2">
        {/* Left side - Content */}
        <div className="flex flex-col gap-4 p-6 md:p-6">
          <Link href="/vendor-auth/login" className="flex items-center gap-2 font-medium mb-4">
            <ArrowLeft size={20} />
            <span>Back to Login</span>
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-xs text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[#05563E] rounded-full flex items-center justify-center">
                  <CheckCheck className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900">Registration Submitted</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your application has been sent for approval. You will receive an email once an admin reviews your account.
                </p>
              </div>

              <Link href="/vendor-auth/login">
                <Button className="w-full rounded-full bg-[#05563E] hover:bg-[#03563E] p-5 text-white font-semibold transition-colors">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Background */}
        <div
          className="relative w-full h-96 lg:h-full hidden lg:flex items-end bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556741533-927182355585?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
        >
          <div className="absolute inset-0 bg-[#05563E]/50" />
          <div className="relative z-10 text-white text-start p-14 w-full">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="mt-2 text-lg">Your application is being reviewed by our team. We'll notify you soon!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-6">
        <div className="flex justify-between items-center md:p-4">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <Link href="/auth/login" className="text-sm font-medium hover:underline">
            Have an account?
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FieldGroup>
                {/* Header */}
                <div className="flex flex-col items-start text-start space-y-4">
                  <h1 className="text-2xl font-bold">Become a Vendor</h1>
                  <p className="text-sm text-gray-500">
                    Build your reseller network and earn commissions
                  </p>
                </div>

                {/* Business Name */}
                <Field className="space-y-2">
                  <label htmlFor="businessName" className="text-sm font-medium text-slate-700">
                    Business Name
                  </label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    disabled={isLoading}
                    {...register("businessName")}
                    className="w-full px-4 py-3 rounded-sm border border-[#EEEEEE] bg-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-grey-500/20 focus:border-grey-500/30 font-normal placeholder:text-gray-500 transition-all"
                  />
                  {errors.businessName && <p className="text-sm text-red-600">{errors.businessName.message}</p>}
                </Field>

                {/* Email */}
                <Field className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    disabled={isLoading}
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-sm border border-[#EEEEEE] bg-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-grey-500/20 focus:border-grey-500/30 font-normal placeholder:text-gray-500 transition-all"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                </Field>

                {/* Phone Number */}
                <Field className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">
                    Phone Number
                  </label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="0241234567"
                    disabled={isLoading}
                    {...register("phoneNumber")}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "")
                    }}
                    className="w-full px-4 py-3 rounded-sm border border-[#EEEEEE] bg-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-grey-500/20 focus:border-grey-500/30 font-normal placeholder:text-gray-500 transition-all"
                  />
                  {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
                </Field>

                {/* Password */}
                <Field className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 6 characters"
                    disabled={isLoading}
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-sm border border-[#EEEEEE] bg-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-grey-500/20 focus:border-grey-500/30 font-normal placeholder:text-gray-500 transition-all"
                  />
                  {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                </Field>

                {/* Confirm Password */}
                <Field className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    {...register("confirmPassword")}
                    className="w-full px-4 py-3 rounded-sm border border-[#EEEEEE] bg-[#EEEEEE] focus:outline-none focus:ring-2 focus:ring-grey-500/20 focus:border-grey-500/30 font-normal placeholder:text-gray-500 transition-all"
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </Field>

                {/* Submit Button */}
                <Field>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-full bg-[#262626] hover:bg-[#5d5d5d] p-5 text-white font-semibold transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </Field>

                {/* Divider */}
                <hr className="border border-[#EEEEEE]" />

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
                    Sign up with Google
                  </Button>
                </Field>
                {/* Login Link */}
                <Field>
                  <p className="text-center text-sm text-gray-600">
                    Already a vendor?{" "}
                    <Link href="/auth/login" className="text-[#05563E] hover:underline font-semibold">
                      Login here
                    </Link>
                  </p>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Background Image */}
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
            <h1 className="text-3xl font-bold">Create An Account</h1>
            <p className="mt-2 text-lg">Sign up to access your dashboard and start managing your subscriptions!</p>
          </div>

        </div>
      </div>
    </div>
  )
}
