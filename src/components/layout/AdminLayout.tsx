"use client";

import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { AdminNavigationItem } from "./AdminNavigationItem";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Tag,
  Bell,
  Store,
  Shield,
} from "lucide-react";
import { AdminNotificationBell } from "@/components/admin/AdminNotificationBell";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Partner Approvals",
      icon: UserCheck,
      href: "/admin/approvals",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Partners",
      icon: Store,
      href: "/admin/users?role=partner",
    },
    {
      title: "Categories",
      icon: Tag,
      href: "/admin/categories",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/admin/notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/30">
          <Sidebar className="border-r bg-card">
            <SidebarHeader className="px-4 py-6">
              {/* Logo with Admin Badge */}
              <div className="flex items-center gap-2">
                <Logo width={100} height={32} />
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  Admin
                </span>
              </div>
              {/* Admin Info */}
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                    <Shield className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    Administrator
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-1">
                    <Suspense
                      fallback={<div className="px-4 py-2">Loading...</div>}
                    >
                      {menuItems.map(item => (
                        <AdminNavigationItem key={item.title} item={item} />
                      ))}
                    </Suspense>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="lg:hidden" />
                <h2 className="text-lg font-semibold">Admin Portal</h2>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle />
                <AdminNotificationBell />
              </div>
            </header>
            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
