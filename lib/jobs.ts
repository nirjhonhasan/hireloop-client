"use client"

import type { Company, Job, JobInput } from "@/lib/types"
import { RECRUITER_PLANS } from "@/lib/types"

/**
 * Client for the recruiter API (Express + MongoDB at localhost:5000).
 * Routes: GET/POST /jobs, PATCH /jobs/:id, DELETE /jobs/:id.
 * Override with NEXT_PUBLIC_API_URL when deploying.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

class ApiError extends Error {
  constructor(path: string, status: number) {
    super(`Request to ${path} failed with ${status}`)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "content-type": "application/json" },
    ...init,
  })
  if (!response.ok) throw new ApiError(path, response.status)
  return (await response.json()) as T
}

// ---------------------------------------------------------------------------
// Mock recruiter company (posted jobs get linked to it until the company API)
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
// Jobs CRUD — thin wrappers over the server routes
// ---------------------------------------------------------------------------

export function getJobs(): Promise<Job[]> {
  return request<Job[]>("/jobs")
}

export function createJob(input: JobInput): Promise<Job> {
  return request<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify({
      ...input,
      company: {
        id: DEMO_COMPANY.id,
        name: DEMO_COMPANY.name,
        industry: DEMO_COMPANY.industry,
        logo: DEMO_COMPANY.logo,
      },
    }),
  })
}

export function updateJob(id: string, patch: Partial<JobInput>): Promise<void> {
  return request<void>(`/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  })
}

/** Close and re-open follow the status flow from the requirements. */
export function changeJobStatus(
  id: string,
  status: Job["status"]
): Promise<void> {
  return updateJob(id, { status })
}

export function deleteJob(id: string): Promise<void> {
  return request<void>(`/jobs/${id}`, { method: "DELETE" })
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
