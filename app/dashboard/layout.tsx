
import DashboardSidebar from "@/app/components/DashboardSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <div>
        <SidebarProvider>

            <DashboardSidebar />
            <section>{children}</section>
        </SidebarProvider>
    </div>
}