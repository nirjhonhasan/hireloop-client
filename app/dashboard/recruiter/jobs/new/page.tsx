import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PostJobForm } from "@/app/components/recruiter/post-job-form"

export default function PostJobPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-4xl space-y-4 p-4 md:p-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-72 rounded-lg" />
          <Skeleton className="h-56 rounded-lg" />
        </div>
      }
    >
      <PostJobForm />
    </Suspense>
  )
}
