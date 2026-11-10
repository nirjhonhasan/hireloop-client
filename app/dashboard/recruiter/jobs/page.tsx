"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useJobs, useJobMutation } from "@/hooks/use-jobs"
import {
  changeJobStatus,
  deleteJob,
  formatSalary,
  formatDate,
  getActiveJobLimit,
  getRecruiterPlan,
} from "@/lib/jobs"
import type { Job, JobStatus } from "@/lib/types"
import {
  Briefcase,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Users,
} from "lucide-react"

const STATUS_VARIANT: Record<JobStatus, string> = {
  Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Closed: "text-muted-foreground border-border",
  Draft: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
}

function UsageIndicator({ jobs }: { jobs: Job[] }) {
  const limit = getActiveJobLimit()
  const plan = getRecruiterPlan()
  const active = jobs.filter((job) => job.status === "Active").length
  const reached = active >= limit
  const percent = Math.min(100, Math.round((active / limit) * 100))

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Plan usage</span>
        <Badge variant="secondary">{plan} plan</Badge>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{active}</span> of{" "}
        <span className="font-semibold text-foreground">{limit}</span> active
        job posts used
      </p>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={active}
        aria-valuemin={0}
        aria-valuemax={limit}
      >
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      {reached && (
        <p className="mt-2 text-xs text-amber-400">
          Limit reached — upgrade your plan to post more jobs.
        </p>
      )}
    </div>
  )
}

function RowActions({
  job,
  refetch,
}: {
  job: Job
  refetch: () => Promise<void>
}) {
  const router = useRouter()
  const { run } = useJobMutation()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const withToast = (mutation: () => Promise<unknown>, success: string) =>
    run(async () => {
      await mutation()
      await refetch()
      toast.success(success)
    })

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (!open) setConfirmDelete(false)
      }}
    >
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="Row actions" />}
      >
        <MoreHorizontal className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/recruiter/jobs/new?id=${job._id}`)
          }
        >
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            toast.info(
              "Applicant tracking will come with the applications API."
            )
          }
        >
          <Users />
          View Applicants
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            withToast(
              () =>
                changeJobStatus(
                  job._id,
                  job.status === "Active" ? "Closed" : "Active"
                ),
              job.status === "Active" ? "Job closed." : "Job reopened."
            )
          }
        >
          <RotateCcw />
          {job.status === "Active" ? "Close Job" : "Reopen Job"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {confirmDelete ? (
          <DropdownMenuItem
            className="font-medium text-destructive data-highlighted:text-destructive"
            onClick={() =>
              withToast(() => deleteJob(job._id), `Deleted “${job.title}”.`)
            }
          >
            <Trash2 />
            Confirm Delete
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-destructive data-highlighted:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 />
            Delete…
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function ManageJobsPage() {
  const { jobs, error, refetch } = useJobs()

  const sorted = useMemo(
    () =>
      (jobs ?? []).slice().sort((a, b) => b.postedAt.localeCompare(a.postedAt)),
    [jobs]
  )
  const limitReached =
    (jobs ?? []).filter((job) => job.status === "Active").length >=
    getActiveJobLimit()

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review performance, edit or close your job posts.
          </p>
        </div>
        {limitReached ? (
          <Button disabled aria-disabled>
            <Plus />
            Post New Job
          </Button>
        ) : (
          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            nativeButton={false}
          >
            <Plus />
            Post New Job
          </Button>
        )}
      </div>

      <UsageIndicator jobs={jobs ?? []} />

      {error && (
        <p className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {error} Is the API server running on port 5000?
        </p>
      )}

      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead className="text-center">Applicants</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  <Briefcase className="mx-auto mb-3 h-8 w-8 opacity-40" />
                  {jobs === null
                    ? "Loading jobs…"
                    : "No jobs yet — post your first job."}
                </TableCell>
              </TableRow>
            )}
            {sorted.map((job) => (
              <TableRow key={job._id}>
                <TableCell className="max-w-xs">
                  <p className="truncate font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {job.company.name} · {job.category}
                    {job.isRemote ? " · Remote" : ` · ${job.location}`}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={STATUS_VARIANT[job.status]}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.type}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatSalary(job)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    {job.applicants}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(job.postedAt)}
                  {job.status === "Draft" && (
                    <p className="text-xs text-indigo-400">
                      Deadline {formatDate(job.deadline)}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <RowActions job={job} refetch={refetch} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {sorted.length > 0 && (
          <p className="flex items-center gap-1.5 border-t px-4 py-3 text-xs text-muted-foreground">
            <Eye className="h-3.5 w-3.5" />
            {sorted.filter((job) => job.status === "Active").length} active ·{" "}
            {sorted.filter((job) => job.status === "Draft").length} drafts ·{" "}
            {sorted.filter((job) => job.status === "Closed").length} closed
          </p>
        )}
      </div>
    </div>
  )
}
