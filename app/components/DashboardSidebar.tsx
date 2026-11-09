"use client"


import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { PanelLeft } from "lucide-react";

export default function AppSidebar() {
  // হুকটিকে কম্পোনেন্টের ভেতরে রাখা হয়েছে
  const {
    state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeft className="h-5 w-5" />
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}