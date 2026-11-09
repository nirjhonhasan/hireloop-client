import Image from "next/image"
import { BadgeCheck, BriefcaseBusiness, Building2, Users } from "lucide-react"

const stats = [
  { icon: BriefcaseBusiness, value: "50K", label: "Active Jobs" },
  { icon: Building2, value: "12K", label: "Companies" },
  { icon: Users, value: "2M", label: "Job Seekers" },
  { icon: BadgeCheck, value: "97%", label: "Satisfaction Rate" },
]

// Tuning constants for the globe backdrop.
// globe.png is 3:4 portrait: pink/white glow in the top ~35%, sphere rim ~44%
// down, dark sphere body from there to the bottom edge of the image.
// Page-color gradient overlays hide everything but the visible rim band.
const GLOBE_OBJECT_POSITION = "50% 46%"
const TOP_FADE_HEIGHT = "45%"
const BOTTOM_FADE_HEIGHT = "42%"

export function GlobeStats() {
  return (
    <section className="relative mt-10">
      <div className="relative h-[640px] md:h-[720px]">
        <Image
          src="/globe.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: GLOBE_OBJECT_POSITION }}
        />

        {/* Page-color overlays: only the blue rim glow band stays visible. */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-background via-background/60 to-transparent"
          style={{ height: TOP_FADE_HEIGHT }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/50 to-transparent"
          style={{ height: BOTTOM_FADE_HEIGHT }}
        />

        <div
          aria-hidden
          className="absolute top-[44%] left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[110px]"
        />

        <p className="absolute top-[16%] left-1/2 w-full max-w-xl -translate-x-1/2 px-4 text-center text-2xl font-semibold tracking-tight text-balance sm:text-3xl md:text-4xl">
          Assisting over 15,000 job seekers find their dream positions.
        </p>
      </div>

      <div className="relative z-10 mx-auto -mt-32 grid max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/5 bg-[#0c0c11]/90 p-5 backdrop-blur-sm"
          >
            <div className="flex size-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-muted-foreground">
              <stat.icon className="size-4" />
            </div>
            <p className="mt-8 text-3xl font-semibold tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
