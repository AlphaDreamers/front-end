import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Shield } from "lucide-react";
import Link from "next/link";

const ITEMS = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  {
    label: "My Profile",
    icon: Home,
    href: "/profile",
  },
  {
    label: "My Gigs",
    icon: Home,
    href: "/dashboard/gigs",
  },
  {
    label: "Orders",
    icon: Home,
    href: "/orders",
  },
  {
    label: "Settings",
    icon: Home,
    href: "/settings",
  },
  {
    label: "Badges and Skills",
    icon: Shield,
    href: "/badges-skills",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-lg font-bold">
          <Link href="/dashboard">PLACEHOLDER NAME</Link>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>PLACEHOLDER LABEL</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
