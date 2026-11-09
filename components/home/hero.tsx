import { Flame, MapPin, Search } from "lucide-react"

const trendingSearches = [
  "Product Designer",
  "Project Manager",
  "AI Engineer",
  "Developer",
]

export function Hero() {
  return (
    <section className="relative px-4 pt-16 pb-6 md:pt-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/5 py-1.5 pr-3 pl-2.5">
          <Flame className="size-3.5 text-orange-500" />
          <span className="text-xs font-semibold text-orange-400">50,000+</span>
          <span className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
            New jobs this month
          </span>
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tighter text-balance sm:text-5xl md:text-6xl">
          Find Your Dream Job Today
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
          HireLoop connects ambitious talent with forward-thinking companies.
          Discover your next career opportunity powered by smart search and
          match.
        </p>

        <form
          action="#"
          className="mt-8 flex w-full flex-col gap-1.5 rounded-2xl bg-white p-1.5 text-left shadow-2xl shadow-indigo-950/40 sm:flex-row sm:items-center"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2.5 pr-2 pl-3">
            <Search className="size-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              name="query"
              placeholder="Job title or company"
              className="h-11 w-full min-w-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="hidden h-6 w-px shrink-0 bg-neutral-200 sm:block" />

          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:max-w-56 sm:pl-2">
            <MapPin className="size-4 shrink-0 text-neutral-400" />
            <input
              type="text"
              name="location"
              placeholder="Location or filter"
              className="h-11 w-full min-w-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          <button
            type="submit"
            aria-label="Search"
            className="flex size-11 shrink-0 items-center justify-center self-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-500"
          >
            <Search className="size-4" />
          </button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-muted-foreground">Trending:</span>
          {trendingSearches.map((term) => (
            <a
              key={term}
              href="#"
              className="rounded-full border border-white/10 px-3 py-1 text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
            >
              {term}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
