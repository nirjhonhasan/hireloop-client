import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { label: "Browse Jobs", href: "#browse-jobs" },
  { label: "Companies", href: "#companies" },
  { label: "Pricing", href: "#pricing" },
]

export function SiteHeader() {
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
      </div>
    </header>
  )
}
