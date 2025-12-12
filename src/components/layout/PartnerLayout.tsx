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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/ui/logo';

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
          <Sidebar className="bg-[#f4f4f5] border-r-0">
            <SidebarHeader className="h-40 justify-center">
              <div className="flex flex-col px-4 gap-4 w-full">
                <div className="self-start">
                  <Logo width={100} height={32} />
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden">
                    {user?.partner?.profileImage ? (
                        <img 
                          src={user.partner.profileImage} 
                          alt={user.partner.partnerName} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{user?.partner?.partnerName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="gap-2 px-2">
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
                                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-gray-200"
                              >
                                <item.icon className="mr-2 h-4 w-4" />
                                <span className="font-medium">{item.title}</span>
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
                                        className="data-[active=true]:text-primary font-medium"
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
                              className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-gray-200"
                            >
                              <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                <span className="font-medium">{item.title}</span>
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
          </Sidebar>
          <SidebarInset className="bg-white">
            <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b px-6 bg-white">
              <Link href="/partner/notifications" className="relative">
                <Bell className="h-6 w-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
              </Link>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground overflow-hidden hover:opacity-90 transition-opacity cursor-pointer">
                      {user?.partner?.profileImage ? (
                        <img 
                          src={user.partner.profileImage} 
                          alt={user.partner.partnerName} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.partner?.partnerName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 p-8">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}

