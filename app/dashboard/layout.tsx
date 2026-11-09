import DashboardSidebar from "@/app/components/DashboardSidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The dashboard is a dark surface per the Figma, independent of site theme.
  return (
    <div className="dark flex min-h-dvh bg-sidebar text-sidebar-foreground">
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="bg-background">
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <span className="text-sm font-medium text-muted-foreground">
              HireLoop Dashboard
            </span>
          </header>
          <main className="flex-1">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
