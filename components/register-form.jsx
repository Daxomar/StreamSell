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
import { CheckCircle } from "lucide-react"

// Registration validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .regex(/^0[2-9]\d{8}$/, "Enter a valid phone number (e.g. 0241234567)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    vendor: z.literal(true).optional(), // For future use if we want to differentiate between regular users and vendors
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function RegisterForm({ vendorCode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
   console.log("Submitting registration data:", data, "Vendor code:", vendorCode)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          credentials: "include",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,
            vendor: data.vendor, 
            parentVendorCode: vendorCode || null, // Pass vendor code if available, otherwise null just for now
          }),
        }
      )

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
      toast.error(error.message || "Failed to sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Registration Submitted</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Your application has been sent for approval. You will receive an
                email once an admin reviews your account.
              </p>
            </div>
          </div>

          <Field>
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
            >
              Back to Login
            </Button>
          </Field>
        </FieldGroup>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Become a Reseller</h1>
          <p className="text-sm text-muted-foreground">
            Start reselling products and earn your profits today!
          </p>
        </div>

        {/* Full Name */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            disabled={isLoading}
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </Field>

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </Field>

        {/* Phone Number */}
        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            placeholder="0241234567"
            required
            disabled={isLoading}
            {...register("phoneNumber")}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, "")
            }}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              required
              disabled={isLoading}
              {...register("password")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </Field>

        {/* Confirm Password */}
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
              {...register("confirmPassword")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              <span className="sr-only">
                {showConfirmPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </Field>


         {/* Want to be a vendor */}
          <Field>
          <FieldLabel htmlFor="vendor">Want to be a vendor?</FieldLabel>
          <div className="relative">
            <Input
              id="vendor"
              type="checkbox"
              placeholder="Confirm if you want to be a vendor"
              required
              disabled={isLoading}
              {...register("vendor")}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              disabled={isLoading}
            >
            </Button>
          </div>
          {errors.vendor && (
            <p className="text-sm text-red-600">
              {errors.vendor.message}
            </p>
          )}
        </Field>
        {/* Submit */}
        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors"
          >
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </Field>

        {/* Separator */}
        <FieldSeparator>Already have an account?</FieldSeparator>

        {/* Sign in link */}
        <Field>
          <FieldDescription className="text-center">
            <a href="/auth/login" className="underline underline-offset-4">
              Sign in here
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}