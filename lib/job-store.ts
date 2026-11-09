"use client"

import type { Company, Job, JobInput } from "@/lib/types"
import { RECRUITER_PLANS } from "@/lib/types"

/**
 * Tiny client-side job store backed by localStorage.
 * Swap these functions for API calls when the backend lands — every page and
 * form talks to the jobs data only through this module.
 */

const STORAGE_KEY = "hireloop:jobs"
const UPDATE_EVENT = "hireloop:jobs-updated"

// ---------------------------------------------------------------------------
// Mock recruiter company (persists in-memory; replace with API later)
// ---------------------------------------------------------------------------

export const DEMO_COMPANY: Company = {
  id: "company_demo",
  name: "HireLoop Labs",
  industry: "Software Development",
  location: "Dhaka, Bangladesh",
  employeeCount: "10-30",
  website: "https://hireloop.dev",
  logo: "/logo.png",
  description:
    "The modern job hunting portal, built for seekers and recruiters.",
  status: "Approved",
}

export function getRecruiterPlan(): keyof typeof RECRUITER_PLANS {
  return "Free"
}

export function getActiveJobLimit(
  plan: keyof typeof RECRUITER_PLANS = getRecruiterPlan()
): number {
  return RECRUITER_PLANS[plan]
}

// ---------------------------------------------------------------------------
// Seed data so Manage Jobs isn't empty on first visit
// ---------------------------------------------------------------------------

function seedJobs(): Job[] {
  const now = new Date()
  const daysAgo = (days: number) => {
    const date = new Date(now)
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }

  return [
    {
      id: "job_seed_1",
      title: "Senior Frontend Engineer",
      category: "Engineering",
      type: "Full-time",
      salaryMin: 4000,
      salaryMax: 6000,
      currency: "USD",
      location: "Dhaka, Bangladesh",
      isRemote: true,
      deadline: "2026-12-01",
      description: {
        responsibilities:
          "Own the recruiter dashboard surfaces.\nShip features end to end.",
        requirements: "5+ years with React and TypeScript.",
        benefits: "Health insurance, remote allowance.",
      },
      status: "Active",
      applicants: 14,
      postedAt: daysAgo(2),
      company: {
        id: DEMO_COMPANY.id,
        name: DEMO_COMPANY.name,
        industry: DEMO_COMPANY.industry,
        logo: DEMO_COMPANY.logo,
      },
    },
    {
      id: "job_seed_2",
      title: "Product Designer",
      category: "Design",
      type: "Contract",
      salaryMin: 2500,
      salaryMax: 3500,
      currency: "USD",
      location: "Remote",
      isRemote: true,
      deadline: "2026-11-20",
      description: {
        requirements: "Portfolio with dashboard work.",
      },
      status: "Draft",
      applicants: 0,
      postedAt: daysAgo(1),
      company: {
        id: DEMO_COMPANY.id,
        name: DEMO_COMPANY.name,
        industry: DEMO_COMPANY.industry,
        logo: DEMO_COMPANY.logo,
      },
    },
  ]
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

function readJobs(): Job[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedJobs()
    return JSON.parse(raw) as Job[]
  } catch {
    return seedJobs()
  }
}

function writeJobs(jobs: Job[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT))
}

function createId() {
  return `job_${Math.random().toString(36).slice(2, 10)}`
}

// ---------------------------------------------------------------------------
// CRUD + subscription
// ---------------------------------------------------------------------------

export function getJobs(): Job[] {
  return readJobs()
}

export function createJob(input: JobInput): Job {
  const job: Job = {
    ...input,
    id: createId(),
    applicants: 0,
    postedAt: new Date().toISOString(),
    company: {
      id: DEMO_COMPANY.id,
      name: DEMO_COMPANY.name,
      industry: DEMO_COMPANY.industry,
      logo: DEMO_COMPANY.logo,
    },
  }
  writeJobs([job, ...readJobs()])
  return job
}

export function updateJob(id: string, patch: Partial<JobInput>): void {
  writeJobs(
    readJobs().map((job) => (job.id === id ? { ...job, ...patch } : job))
  )
}

export function toggleJobStatus(id: string): void {
  writeJobs(
    readJobs().map((job) => {
      if (job.id !== id) return job
      const next: Job["status"] = job.status === "Active" ? "Closed" : "Active"
      return { ...job, status: next }
    })
  )
}

export function deleteJob(id: string): void {
  writeJobs(readJobs().filter((job) => job.id !== id))
}

/** Subscribe to job changes (same tab and cross-tab). */
export function subscribeJobs(callback: (jobs: Job[]) => void): () => void {
  const notify = () => callback(readJobs())
  notify()
  window.addEventListener(UPDATE_EVENT, notify)
  window.addEventListener("storage", notify)
  return () => {
    window.removeEventListener(UPDATE_EVENT, notify)
    window.removeEventListener("storage", notify)
  }
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatSalary(
  job: Pick<Job, "salaryMin" | "salaryMax" | "currency">
): string {
  return `${job.currency} ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
