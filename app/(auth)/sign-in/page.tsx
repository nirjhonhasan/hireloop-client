"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
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

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formValue = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    )

    const { data, error: signInError } = await authClient.signIn.email({
      email: formValue.email as string,
      password: formValue.password as string,
      callbackURL: "/",
    })

    if (signInError) {
      setError(signInError.message ?? "Failed to sign in")
      setLoading(false)
      return
    }

    router.push(`/dashboard/${data?.user.role ?? "seeker"}`)
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-[#08070B] font-sans text-slate-100">
      {/* Background Subtle Gradient & Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-100 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-100 w-[800px] -translate-x-1/2 rounded-full bg-blue-600/15 blur-[140px]" />

      {/* Main Form Section */}
      <section className="z-10 mt-30 flex w-full items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-slate-800/80 bg-slate-900/60 shadow-2xl backdrop-blur-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">
              Enter your credentials to access your HireLoop account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-slate-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-medium text-slate-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
                  required
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
                className="w-full bg-indigo-600 font-medium text-white shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500"
              >
                {loading && (
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                )}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0e131f] px-2 text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full border-slate-800 bg-slate-950/50 text-slate-200 hover:bg-slate-800 hover:text-white"
              onClick={() => authClient.signIn.social({ provider: "google" })}
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-800/60 pt-4">
            <p className="text-xs text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                Get Started
              </Link>
            </p>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
