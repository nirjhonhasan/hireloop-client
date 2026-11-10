"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PanelLeft, LogOut } from "lucide-react"
import { signOut, useSession } from "@/lib/auth-client"
import { GUEST_USER, PUBLIC_NAV, ROLE_NAV } from "@/lib/navigation"
import type { UserRole } from "@/lib/types"

const ROLE_LABEL: Record<UserRole, string> = {
  seeker: "Seeker",
  recruiter: "Recruiter",
  admin: "Admin",
}

/** Highlights the most specific matching route, not every ancestor. */
function isItemActive(
  href: string,
  items: { href: string }[],
  pathname: string
) {
  if (pathname !== href && !pathname.startsWith(`${href}/`)) return false
  const specificMatch = items.some(
    (other) =>
      other.href !== href &&
      other.href.length > href.length &&
      (pathname === other.href || pathname.startsWith(`${other.href}/`))
  )
  return !specificMatch
}

function NavLink({
  item,
  items,
}: {
  item: { title: string; href: string; icon: React.ElementType }
  items: { title: string; href: string; icon: React.ElementType }[]
}) {
  const pathname = usePathname()
  const active = isItemActive(item.href, items, pathname)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={active}
        tooltip={item.title}
        render={<Link href={item.href} />}
      >
        <item.icon />
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarLogo() {
  const { toggleSidebar } = useSidebar()

  return (
    <SidebarHeader className="flex flex-row items-center justify-between gap-2 p-3">
      <Link
        href="/"
        className="flex min-w-0 items-center gap-2 overflow-hidden"
      >
        <Image
          src="/logo.png"
          alt="HireLoop"
          width={104}
          height={28}
          className="h-5 w-auto shrink-0"
        />
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        className="text-sidebar-foreground/70"
      >
        <PanelLeft className="h-4 w-4" />
      </Button>
    </SidebarHeader>
  )
}

function SidebarProfile() {
  const { data } = useSession()
  const user = data?.user
  const name = user?.name ?? GUEST_USER.name
  const email = user?.email ?? GUEST_USER.email
  const image = user?.image ?? null
  const role = ((user as { role?: UserRole } | undefined)?.role ??
    GUEST_USER.role) as UserRole
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-3">
      <div className="flex items-center gap-2">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {initials || "U"}
          </div>
        )}
        <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {name}
          </p>
          <p className="truncate text-xs text-sidebar-foreground/60">{email}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
        <Badge
          variant="secondary"
          className="group-data-[collapsible=icon]:hidden"
        >
          {ROLE_LABEL[role]}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Log out"
          className="h-7 w-7 text-sidebar-foreground/60 hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function DashboardSidebar() {
  const { data } = useSession()
  const role = ((data?.user as { role?: UserRole } | undefined)?.role ??
    "recruiter") as UserRole
  const sections = ROLE_NAV[role]

  return (
    <Sidebar collapsible="icon">
      <SidebarLogo />
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.heading}>
            <SidebarGroupLabel className="tracking-wider text-sidebar-foreground/50 uppercase">
              {section.heading}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <NavLink key={item.title} item={item} items={section.items} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        <SidebarGroup>
          <SidebarGroupLabel className="tracking-wider text-sidebar-foreground/50 uppercase">
            {PUBLIC_NAV.heading}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PUBLIC_NAV.items.map((item) => (
                <NavLink
                  key={item.title}
                  item={item}
                  items={PUBLIC_NAV.items}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
