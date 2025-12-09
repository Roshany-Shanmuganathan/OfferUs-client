'use client';

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Ticket,
  Bell,
  HelpCircle,
  QrCode,
  History,
  FileText,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  User,
  Star,
} from 'lucide-react';
import { useState } from 'react';

export function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/partner',
    },
    {
      title: 'Offers',
      icon: Tag,
      href: '/partner/offers',
    },
    {
      title: 'Redemptions',
      icon: Ticket,
      href: '/partner/redemptions',
      hasSubmenu: true,
      children: [
        {
          title: 'Redemption Requests',
          href: '/partner/redemptions/requests',
        },
        {
          title: 'Redemption History',
          href: '/partner/redemptions/history',
        },
        {
          title: 'QR Code Scan',
          href: '/partner/redemptions/scan',
        },
      ],
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      href: '/partner/analytics',
    },
    {
      title: 'Reviews',
      icon: Star,
      href: '/partner/reviews',
    },
    {
      title: 'Notifications',
      icon: Bell,
      href: '/partner/notifications',
      hasSubmenu: true,
      children: [
        {
          title: 'System Notifications',
          href: '/partner/notifications/system',
        },
        {
          title: 'Offers Notifications',
          href: '/partner/notifications/offers',
        },
        {
          title: 'Alerts',
          href: '/partner/notifications/alerts',
        },
      ],
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/partner/settings',
    },
    {
      title: 'Support',
      icon: HelpCircle,
      href: '/partner/support',
      hasSubmenu: true,
      children: [
        {
          title: 'Help Center',
          href: '/partner/support/help',
        },
        {
          title: 'FAQs',
          href: '/partner/support/faqs',
        },
        {
          title: 'Contact Support',
          href: '/partner/support/contact',
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/partner') {
      return pathname === '/partner';
    }
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute allowedRoles={['partner']} requireApproved={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="flex h-12 items-center px-4">
                <span className="text-lg font-bold">OfferUs Partner</span>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" className="h-auto py-4 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="flex aspect-square size-16 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden">
                        {user?.partner?.profileImage ? (
                          <img 
                            src={user.partner.profileImage} 
                            alt={user.partner.partnerName} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="size-8" />
                        )}
                      </div>
                      <div className="grid flex-1 text-center text-sm leading-tight">
                        <span className="truncate font-semibold text-base">
                          {user?.partner?.partnerName || 'Partner Portal'}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => {
                      const isItemActive = isActive(item.href);
                      const isOpen = openMenus[item.title] ?? false;
                      const hasChildren = item.hasSubmenu && item.children;

                      return (
                        <SidebarMenuItem key={item.title}>
                          {hasChildren ? (
                            <>
                              <SidebarMenuButton
                                onClick={() => toggleMenu(item.title)}
                                isActive={isItemActive}
                              >
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                                <ChevronRight
                                  className={`ml-auto h-4 w-4 transition-transform ${
                                    isOpen ? 'rotate-90' : ''
                                  }`}
                                />
                              </SidebarMenuButton>
                              {isOpen && (
                                <SidebarMenuSub>
                                  {item.children?.map((child) => (
                                    <SidebarMenuSubItem key={child.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={pathname === child.href}
                                      >
                                        <Link href={child.href}>
                                          <span>{child.title}</span>
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              )}
                            </>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              isActive={isItemActive}
                            >
                              <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
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
            <main className="flex-1 p-8">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

