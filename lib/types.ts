/**
 * Central domain types for the HireLoop dashboard.
 * Keep every shared type here so pages, forms, and stores stay consistent.
 */

// ---------------------------------------------------------------------------
// Users & roles
// ---------------------------------------------------------------------------

export type UserRole = "seeker" | "recruiter" | "admin"

export interface SessionUser {
  id: string
  name: string
  email: string
  avatar: string | null
  role: UserRole
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Contract",
  "Internship",
] as const
export type JobType = (typeof JOB_TYPES)[number]

export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "Human Resources",
] as const
export type JobCategory = (typeof JOB_CATEGORIES)[number]

export const JOB_STATUSES = ["Active", "Closed", "Draft"] as const
export type JobStatus = (typeof JOB_STATUSES)[number]

export const CURRENCIES = ["USD", "EUR", "GBP", "BDT"] as const
export type Currency = (typeof CURRENCIES)[number]

export interface Job {
  /** MongoDB document id (serialized to string by the server). */
  _id: string
  title: string
  category: JobCategory
  type: JobType
  /** Monthly salary range, as posted. */
  salaryMin: number
  salaryMax: number
  currency: Currency
  /** City, Country. Empty string when fully remote. */
  location: string
  isRemote: boolean
  /** ISO date (YYYY-MM-DD). */
  deadline: string
  description: {
    responsibilities?: string
    requirements?: string
    benefits?: string
  }
  status: JobStatus
  applicants: number
  /** Date the job was posted. */
  postedAt: string
  company: Pick<Company, "id" | "name" | "industry" | "logo">
}

/** payload for the "Post a Job" form — id/counts/status are server-managed. */
export interface JobInput {
  title: string
  category: JobCategory
  type: JobType
  salaryMin: number
  salaryMax: number
  currency: Currency
  location: string
  isRemote: boolean
  deadline: string
  description: {
    responsibilities?: string
    requirements?: string
    benefits?: string
  }
  status: JobStatus
}

// ---------------------------------------------------------------------------
// Companies
// ---------------------------------------------------------------------------

export type CompanyStatus = "Pending" | "Approved" | "Rejected"

export interface Company {
  id: string
  name: string
  industry: string
  location: string
  employeeCount: string
  website: string
  logo: string | null
  description: string
  status: CompanyStatus
}

// ---------------------------------------------------------------------------
// Recruiter plans — active-job-post limits drive the Manage Jobs usage bar
// ---------------------------------------------------------------------------

export const RECRUITER_PLANS = {
  Free: 3,
  Growth: 10,
  Enterprise: 50,
} as const satisfies Record<string, number>

export type RecruiterPlan = keyof typeof RECRUITER_PLANS
