import Link from "next/link"

export default function RecruiterDashboardPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Recruiter Dashboard
        </h1>
        <p className="mt-3 text-muted-foreground">
          Post jobs and manage candidates from here.
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
