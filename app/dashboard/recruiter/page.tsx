import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilePlus2, Briefcase } from "lucide-react"

const QUICK_LINKS = [
  {
    title: "Post a Job",
    href: "/dashboard/recruiter/jobs/new",
    icon: FilePlus2,
  },
  { title: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: Briefcase },
]

export default function RecruiterDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Recruiter Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Post jobs and manage candidates from here.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {QUICK_LINKS.map((link) => (
          <Button
            key={link.href}
            variant="outline"
            size="lg"
            render={<Link href={link.href} />}
            nativeButton={false}
          >
            <link.icon />
            {link.title}
          </Button>
        ))}
      </div>
    </div>
  )
}
