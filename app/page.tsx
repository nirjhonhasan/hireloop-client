import { Hero } from "@/components/home/hero"
import { GlobeStats } from "@/components/home/globe-stats"
import { FeaturedRoles } from "@/components/home/featured-roles"

const HomePage = () => {
  return (
    <div className="dark min-h-screen overflow-x-clip bg-background text-foreground">
      <main>
        <Hero />
        <GlobeStats />
        <FeaturedRoles />
      </main>
    </div>
  )
}

export default HomePage
