import Link from "next/link"

export default function SeekerDashboardPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Job Seeker Dashboard
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your applications and recommendations will live here.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm text-indigo-400 hover:text-indigo-300"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
