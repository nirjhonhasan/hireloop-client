"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BriefcaseBusiness, Building2, Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"

type Role = "seeker" | "recruiter"

const roleOptions = [
  {
    value: "seeker" as Role,
    label: "Job Seeker",
    description: "Find and apply to roles",
    icon: BriefcaseBusiness,
  },
  {
    value: "recruiter" as Role,
    label: "Recruiter",
    description: "Hire great talent",
    icon: Building2,
  },
  {
    value: "admin" as Role,
    label: "Admin",
    description: "Control whole site",
    icon: Building2,
  },
]

export default function SignUpPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("seeker")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formValue = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    )

    const { data, error: signUpError } = await authClient.signUp.email({
      name: formValue.name as string,
      email: formValue.email as string,
      password: formValue.password as string,
      role,
      callbackURL: "/",
    })

    if (signUpError) {
      setError(signUpError.message ?? "Failed to sign up")
      setLoading(false)
      return
    }

    // signUp.email creates a session, so the user is now signed in.
    router.push(`/dashboard/${data?.user.role ?? "seeker"}`)
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#08070B] font-sans text-slate-100">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-100 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-100 w-[800px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Main Content Section */}
      <main className="z-10 mt-10 flex w-full items-center justify-center px-4 py-6">
        <Card className="w-full max-w-md border-slate-800/80 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-1.5 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Create an account
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              Enter your information to get started with HireLoop
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Button
              variant="outline"
              type="button"
              className="w-full border-slate-800 bg-slate-950/50 text-slate-200 hover:bg-slate-800 hover:text-white"
              onClick={() => authClient.signIn.social({ provider: "google" })}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign up with Google
            </Button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0e131f] px-2 text-slate-400">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Role Selection */}
              <input type="hidden" name="role" value={role} />
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">
                  Select Role
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      aria-pressed={role === option.value}
                      className={`flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors ${
                        role === option.value
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-950/70 hover:border-slate-700"
                      }`}
                    >
                      <option.icon
                        className={`size-4 ${
                          role === option.value
                            ? "text-indigo-400"
                            : "text-slate-400"
                        }`}
                      />
                      <span className="text-sm font-medium text-slate-100">
                        {option.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {option.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-xs font-medium text-slate-300"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  className="border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="mt-3 w-full bg-indigo-600 font-medium text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500"
              >
                {loading && (
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                )}
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-800/60 pt-4">
            <p className="text-xs text-slate-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
