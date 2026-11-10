"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  createJob,
  updateJob,
  getActiveJobLimit,
  getJobs,
  getRecruiterPlan,
  DEMO_COMPANY,
} from "@/lib/jobs"
import {
  CURRENCIES,
  JOB_CATEGORIES,
  JOB_TYPES,
  type Currency,
  type JobCategory,
  type JobType,
} from "@/lib/types"
import { ArrowLeft, Building2, CircleCheck, Send, Save } from "lucide-react"

interface JobFormState {
  title: string
  category: JobCategory
  type: JobType
  salaryMin: string
  salaryMax: string
  currency: Currency
  location: string
  isRemote: boolean
  deadline: string
  responsibilities: string
  requirements: string
  benefits: string
}

const DEFAULT_FORM: JobFormState = {
  title: "",
  category: "Engineering",
  type: "Full-time",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  location: "",
  isRemote: false,
  deadline: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
}

/**
 * "Post a Job" form for recruiters — Job Info, Job Description and the
 * auto-filled Company section, matching the Figma. Also handles edit mode
 * via the `?id=` query param.
 */
export function PostJobForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState<JobFormState>(DEFAULT_FORM)

  // Pre-fill the form when editing an existing job (server fetch is async).
  useEffect(() => {
    if (!editId) return
    let cancelled = false
    void getJobs().then((jobs) => {
      if (cancelled) return
      const job = jobs.find((candidate) => candidate._id === editId)
      if (!job) return
      setForm({
        title: job.title,
        category: job.category,
        type: job.type,
        salaryMin: String(job.salaryMin),
        salaryMax: String(job.salaryMax),
        currency: job.currency,
        location: job.location,
        isRemote: job.isRemote,
        deadline: job.deadline,
        responsibilities: job.description.responsibilities ?? "",
        requirements: job.description.requirements ?? "",
        benefits: job.description.benefits ?? "",
      })
    })
    return () => {
      cancelled = true
    }
  }, [editId])

  const set = <Key extends keyof JobFormState>(
    key: Key,
    value: JobFormState[Key]
  ) => setForm((current) => ({ ...current, [key]: value }))

  function validate(): string | null {
    if (form.title.trim().length < 3) return "Job title is required."
    if (!Number(form.salaryMin) || Number(form.salaryMin) <= 0)
      return "Salary minimum must be greater than zero."
    if (Number(form.salaryMax) < Number(form.salaryMin))
      return "Salary maximum must be greater than or equal to the minimum."
    if (!form.isRemote && !form.location.trim())
      return "Location is required (or toggle Remote)."
    if (!form.deadline) return "Application deadline is required."
    return null
  }

  function toJobInput(status: "Active" | "Draft") {
    return {
      title: form.title.trim(),
      category: form.category,
      type: form.type,
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      currency: form.currency,
      location: form.isRemote ? "Remote" : form.location.trim(),
      isRemote: form.isRemote,
      deadline: form.deadline,
      description: {
        responsibilities: form.responsibilities.trim() || undefined,
        requirements: form.requirements.trim() || undefined,
        benefits: form.benefits.trim() || undefined,
      },
      status,
    }
  }

  async function submit(status: "Active" | "Draft") {
    if (submitting) return
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }

    if (status === "Active" && !editId) {
      const activeJobs = (await getJobs()).filter(
        (job) => job.status === "Active"
      ).length
      if (activeJobs >= getActiveJobLimit(getRecruiterPlan())) {
        toast.error(
          `The ${getRecruiterPlan()} plan allows ${getActiveJobLimit()} active job posts. Upgrade to post more.`
        )
        return
      }
    }

    const done = editId
      ? updateJob(editId, toJobInput(status)).then(() =>
          toast.success("Job updated.")
        )
      : createJob(toJobInput(status)).then(() =>
          toast.success(
            status === "Draft"
              ? "Job saved as draft."
              : `${form.title.trim()} is now live.`
          )
        )
    setSubmitting(true)
    try {
      await done
      router.push("/dashboard/recruiter/jobs")
    } catch {
      toast.error(
        "The server rejected the request. Is the API running on port 5000?"
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<Link href="/dashboard/recruiter/jobs" />}
          >
            <ArrowLeft />
            <span className="sr-only">Back to Manage Jobs</span>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {editId ? "Edit Job" : "Post a New Job"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {editId
                ? "Update the details of this job post."
                : "Fill the sections below to publish a job."}
            </p>
          </div>
        </div>
      </div>

      {/* Job info --------------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Job Info</CardTitle>
          <CardDescription>
            Basics of the role — title, type, salary and location.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Frontend Engineer"
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Job Category</Label>
            <Select
              value={form.category}
              onValueChange={(value) => set("category", value as JobCategory)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Job Type</Label>
            <Select
              value={form.type}
              onValueChange={(value) => set("type", value as JobType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:col-span-2">
            <div className="space-y-2">
              <Label htmlFor="salary-min">Min Salary</Label>
              <Input
                id="salary-min"
                type="number"
                min={0}
                placeholder="4000"
                value={form.salaryMin}
                onChange={(event) => set("salaryMin", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary-max">Max Salary</Label>
              <Input
                id="salary-max"
                type="number"
                min={0}
                placeholder="6000"
                value={form.salaryMax}
                onChange={(event) => set("salaryMax", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(value) => set("currency", value as Currency)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex items-center gap-3 pb-1">
              <Switch
                id="remote"
                checked={form.isRemote}
                onCheckedChange={(checked) => set("isRemote", checked)}
              />
              <Label
                htmlFor="remote"
                className="font-normal text-muted-foreground"
              >
                Fully remote
              </Label>
            </div>
            <Input
              id="location"
              placeholder="City, Country"
              disabled={form.isRemote}
              value={form.isRemote ? "Remote" : form.location}
              onChange={(event) => set("location", event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={form.deadline}
              onChange={(event) => set("deadline", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Job description --------------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Responsibilities and requirements — one per line. Benefits are
            optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="responsibilities">Responsibilities</Label>
            <Textarea
              id="responsibilities"
              rows={4}
              placeholder={
                "Own the recruiter dashboard surfaces.\nShip features end to end."
              }
              value={form.responsibilities}
              onChange={(event) => set("responsibilities", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              rows={4}
              placeholder={
                "5+ years with React and TypeScript.\nExperience with design systems."
              }
              value={form.requirements}
              onChange={(event) => set("requirements", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits (optional)</Label>
            <Textarea
              id="benefits"
              rows={3}
              placeholder={"Health insurance.\nRemote allowance."}
              value={form.benefits}
              onChange={(event) => set("benefits", event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Company (auto-filled) --------------------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Company</CardTitle>
          <CardDescription>
            Auto-filled from your registered company. Contact an admin if this
            needs changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/40 p-4">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-medium">
                {DEMO_COMPANY.name}
                <Badge
                  variant="outline"
                  className="border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
                >
                  <CircleCheck />
                  {DEMO_COMPANY.status}
                </Badge>
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {DEMO_COMPANY.industry} · {DEMO_COMPANY.location}
              </p>
            </div>
            <Badge variant="secondary">
              {getRecruiterPlan()} plan · {getActiveJobLimit()} active jobs
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Actions ------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => void submit("Draft")}
          disabled={submitting}
        >
          <Save />
          Save as Draft
        </Button>
        <Button onClick={() => void submit("Active")} disabled={submitting}>
          <Send />
          {editId ? "Save Changes" : "Publish Job"}
        </Button>
      </div>
    </div>
  )
}
