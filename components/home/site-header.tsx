"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogOut } from "lucide-react"
import { useSession, signOut } from "@/lib/auth-client"

const navLinks = [
  { label: "Browse Jobs", href: "#browse-jobs" },
  { label: "Companies", href: "#companies" },
  { label: "Pricing", href: "#pricing" },
]

export function SiteHeader() {
  const router = useRouter()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="HireLoop"
            width={104}
            height={28}
            priority
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {session ? (
          <UserMenu
            name={session.user.name}
            image={session.user.image ?? undefined}
            role={session.user.role ?? "seeker"}
            open={menuOpen}
            onToggle={() => setMenuOpen(!menuOpen)}
            onClose={() => setMenuOpen(false)}
            onSignOut={handleSignOut}
          />
        ) : (
          <div className="flex items-center gap-1">
            <Link href="/sign-in" className="mr-3 hover:text-purple-500">
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-white hover:bg-indigo-500"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

function UserMenu({
  name,
  image,
  role,
  open,
  onToggle,
  onClose,
  onSignOut,
}: {
  name: string
  image?: string
  role: string
  open: boolean
  onToggle: () => void
  onClose: () => void
  onSignOut: () => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-orange-500 text-sm font-semibold text-white"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="h-full w-full object-cover" />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </button>

      {open && (
        <>
          {/* Click-away catcher */}
          <div aria-hidden className="fixed inset-0" onClick={onClose} />
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#0c0c11] p-1.5 shadow-xl">
            <div className="border-b border-white/5 px-2.5 py-2">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground capitalize">{role}</p>
            </div>
            <Link
              href={`/dashboard/${role}`}
              onClick={onClose}
              className="mt-1.5 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <button
              onClick={onSignOut}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
