import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const roles = [
  {
    title: "Frontend Developer",
    location: "New York, USA",
    workplace: "Hybrid",
    salary: "$5,540–$11,500/mo",
    contract: "Full-time",
  },
  {
    title: "Product Designer",
    location: "London, UK",
    workplace: "Remote",
    salary: "$4,200–$8,900/mo",
    contract: "Full-time",
  },
  {
    title: "AI Engineer",
    location: "San Francisco, USA",
    workplace: "Hybrid",
    salary: "$8,000–$14,200/mo",
    contract: "Full-time",
  },
  {
    title: "Project Manager",
    location: "Berlin, Germany",
    workplace: "On-site",
    salary: "$3,900–$7,600/mo",
    contract: "Contract",
  },
  {
    title: "Backend Developer",
    location: "Toronto, Canada",
    workplace: "Remote",
    salary: "$6,100–$12,300/mo",
    contract: "Full-time",
  },
  {
    title: "Data Analyst",
    location: "Austin, USA",
    workplace: "Hybrid",
    salary: "$4,300–$9,000/mo",
    contract: "Contract",
  },
]

const roleDescription =
  "Showcase your commitment to diversity and inclusive hiring practices while attracting top talent."

export function FeaturedRoles() {
  return (
    <section id="browse-jobs" className="relative mt-24 overflow-hidden pb-24">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
        }}
      >
        <Image
          src="/cta-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-[0.08]"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-indigo-400 uppercase">
            ✦ Smart Job Discovery
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tighter text-balance sm:text-4xl md:text-5xl">
            The roles you&apos;d never
            <br />
            find by searching
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <article
              key={role.title}
              className="group flex flex-col rounded-2xl border border-white/5 bg-[#0c0c11]/80 p-5 transition-colors hover:border-white/10 hover:bg-[#101017]/90"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {role.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {roleDescription}
              </p>

              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span className="size-1.5 shrink-0 rounded-full bg-orange-400" />
                    <span className="truncate">{role.location}</span>
                  </span>
                  <span className="shrink-0 rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                    {role.workplace}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                    <span className="size-1.5 shrink-0 rounded-full bg-indigo-400" />
                    <span className="truncate">{role.salary}</span>
                  </span>
                  <span className="shrink-0 rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                    {role.contract}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-white/5 pt-4">
                <Link
                  href="#"
                  className="inline-flex items-center gap-1.5 text-sm text-foreground/80 transition-colors group-hover:text-foreground"
                >
                  Apply Now
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            className="rounded-lg bg-white px-4 text-neutral-950 hover:bg-neutral-200"
          >
            View all job opens
          </Button>
        </div>
      </div>
    </section>
  )
}
