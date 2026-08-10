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

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export function VendorLoginForm() {
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

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
        credentials: "include",
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to sign in")

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user))
        toast.success("Login successful!")
        await new Promise((r) => setTimeout(r, 500))
        const role = result.user.role?.toLowerCase().trim()
        if (role === "admin") router.push("/admin")
        else if (role === "user") router.push("/reseller")
        else router.push("/")
      } else throw new Error("No user data returned")
    } catch (error) {
      toast.error(error.message || "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

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

        {/* Password */}
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
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
              {showPassword ? <span className="sr-only">Hide password</span> : <span className="sr-only">Show password</span>}
            </Button>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </Field>

        {/* Submit */}
        <Field>
          <Button type="submit" disabled={isLoading} className="w-full border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors">
            {isLoading ? "Signing in..." : "Login"}
          </Button>
        </Field>

        {/* Separator */}
        <FieldSeparator>Or continue with</FieldSeparator>

        {/* Social login */}
        <Field>
          <Button variant="outline" type="button" className="flex items-center justify-center">
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
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/auth/register" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}  