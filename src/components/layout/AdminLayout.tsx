'use client';

import { Suspense } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AdminNavigationItem } from './AdminNavigationItem';
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
} from 'lucide-react';
import { AdminNotificationBell } from '@/components/admin/AdminNotificationBell';
import { Logo } from '@/components/ui/logo';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin',
    },
    {
      title: 'Partner Approvals',
      icon: UserCheck,
      href: '/admin/approvals',
    },
    {
      title: 'Users',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Partners',
      icon: Store,
      href: '/admin/users?role=partner',
    },
    {
      title: 'Categories',
      icon: Tag,
      href: '/admin/categories',
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/admin/analytics',
    },
    {
      title: 'Notifications',
      icon: Bell,
      href: '/admin/notifications',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="h-12 flex items-center gap-2 mb-2 w-full">
                  <Logo width={100} height={32} />
                  <span className="text-sm font-semibold text-muted-foreground pt-1">Admin</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <Suspense fallback={<div>Loading...</div>}>
                      {menuItems.map((item) => (
                        <AdminNavigationItem key={item.title} item={item} />
                      ))}
                    </Suspense>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div className="flex flex-col h-full">
              <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 items-center justify-between px-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Admin Portal</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <AdminNotificationBell />
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto p-8">{children}</main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

