import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  Building2,
  CreditCard,
  FilePlus2,
  FolderOpen,
  Home,
  LayoutDashboard,
  Save,
  Search,
  Settings,
  Users,
} from "lucide-react"
import type { UserRole } from "@/lib/types"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export interface NavSection {
  /** Optional small heading shown above the items, e.g. "Dashboard menu". */
  heading: string
  items: NavItem[]
}

/**
 * Dashboard navigation per role. The sidebar renders the section that matches
 * the logged-in user's role.
 */
export const ROLE_NAV: Record<UserRole, NavSection[]> = {
  recruiter: [
    {
      heading: "Dashboard menu",
      items: [
        {
          title: "Overview",
          href: "/dashboard/recruiter",
          icon: LayoutDashboard,
        },
        {
          title: "My Company",
          href: "/dashboard/recruiter/company",
          icon: Building2,
        },
        {
          title: "Post a Job",
          href: "/dashboard/recruiter/jobs/new",
          icon: FilePlus2,
        },
        {
          title: "Manage Jobs",
          href: "/dashboard/recruiter/jobs",
          icon: Briefcase,
        },
        {
          title: "Billing",
          href: "/dashboard/recruiter/billing",
          icon: CreditCard,
        },
        {
          title: "Settings",
          href: "/dashboard/recruiter/settings",
          icon: Settings,
        },
      ],
    },
  ],
  seeker: [
    {
      heading: "Dashboard menu",
      items: [
        { title: "Overview", href: "/dashboard/seeker", icon: LayoutDashboard },
        {
          title: "Browse & Apply",
          href: "/dashboard/seeker/jobs",
          icon: Search,
        },
        { title: "Saved Jobs", href: "/dashboard/seeker/saved", icon: Save },
        {
          title: "My Applications",
          href: "/dashboard/seeker/applications",
          icon: FolderOpen,
        },
        {
          title: "Billing",
          href: "/dashboard/seeker/billing",
          icon: CreditCard,
        },
        {
          title: "Settings",
          href: "/dashboard/seeker/settings",
          icon: Settings,
        },
      ],
    },
  ],
  admin: [
    {
      heading: "Dashboard menu",
      items: [
        { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { title: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        {
          title: "Manage Companies",
          href: "/dashboard/admin/companies",
          icon: Building2,
        },
        {
          title: "Manage Jobs",
          href: "/dashboard/admin/jobs",
          icon: Briefcase,
        },
        {
          title: "Payments",
          href: "/dashboard/admin/payments",
          icon: CreditCard,
        },
        {
          title: "Settings",
          href: "/dashboard/admin/settings",
          icon: Settings,
        },
      ],
    },
  ],
}

/** Links to public pages, shown in the sidebar for every role. */
export const PUBLIC_NAV: NavSection = {
  heading: "Discover",
  items: [
    { title: "Home", href: "/", icon: Home },
    { title: "Browse Jobs", href: "/jobs", icon: Search },
    { title: "Companies", href: "/companies", icon: Building2 },
  ],
}

/** Fallback user so the sidebar still looks right while signed out. */
export const GUEST_USER = {
  id: "guest",
  name: "Guest Recruiter",
  email: "guest@hireloop.com",
  avatar: null,
  role: "recruiter" as UserRole,
}
