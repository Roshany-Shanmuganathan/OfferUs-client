"use client";

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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Ticket,
  Bell,
  HelpCircle,
  ChevronRight,
  User,
  Star,
  Menu,
  Loader2,
  CreditCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SubscriptionDialog } from "@/components/partner/SubscriptionDialog";

export function PartnerLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

  useEffect(() => {
    // Check if the user is a partner and doesn't have a paid subscription
    if (user?.role === "partner" && user.partner) {
      const hasPaidSubscription = user.partner.subscription?.status === "paid";
      const isSubscriptionPage = pathname === "/partner/subscription";
      
      // Don't show on subscription page itself
      if (!hasPaidSubscription && !isSubscriptionPage) {
        // Check if we already showed it to avoid being too annoying
        // Use localStorage to remember across refreshes and restarts
        const dismissedAt = localStorage.getItem("subscription_dialog_dismissed_at");
        
        // Only show if never dismissed or dismissed more than 24 hours ago
        const shouldShow = !dismissedAt || (Date.now() - parseInt(dismissedAt) > 24 * 60 * 60 * 1000);
        
        if (shouldShow) {
          // Add a small delay for better UX
          const timer = setTimeout(() => {
            setShowSubscriptionDialog(true);
          }, 2000);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [user, pathname]);

  const handleCloseDialog = () => {
    setShowSubscriptionDialog(false);
    localStorage.setItem("subscription_dialog_dismissed_at", Date.now().toString());
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = (key: string) => {
    setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/partner",
    },
    {
      title: "Offers",
      icon: Tag,
      href: "/partner/offers",
    },
    {
      title: "Redemptions",
      icon: Ticket,
      href: "/partner/redemptions",
      hasSubmenu: true,
      children: [
        {
          title: "Redemption Requests",
          href: "/partner/redemptions/requests",
        },
        {
          title: "Redemption History",
          href: "/partner/redemptions/history",
        },
        {
          title: "QR Code Scan",
          href: "/partner/redemptions/scan",
        },
      ],
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/partner/analytics",
    },
    {
      title: "Reviews",
      icon: Star,
      href: "/partner/reviews",
    },
    {
      title: user?.partner?.subscription?.status === "paid" ? "Manage Subscription" : "Subscription",
      icon: CreditCard,
      href: "/partner/subscription",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/partner/settings",
    },
    {
      title: "Support",
      icon: HelpCircle,
      href: "/partner/support",
      hasSubmenu: true,
      children: [
        {
          title: "Help Center",
          href: "/partner/support/help",
        },
        {
          title: "FAQs",
          href: "/partner/support/faqs",
        },
        {
          title: "Contact Support",
          href: "/partner/support/contact",
        },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === "/partner") {
      return pathname === "/partner";
    }
    return pathname.startsWith(href);
  };

  return (
    <ProtectedRoute allowedRoles={["partner"]} requireApproved={true}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/30">
          <Sidebar className="border-r bg-card">
            <SidebarHeader className="px-4 py-6">
              {/* Logo */}
              <div className="mb-6">
                <Logo width={100} height={32} />
              </div>
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  {user?.partner?.profileImage ? (
                    <AvatarImage
                      src={user.partner.profileImage}
                      alt={user.partner.partnerName}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {user?.partner?.partnerName?.charAt(0) || "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {user?.partner?.partnerName}
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
                    {menuItems.map(item => {
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
                                className="h-11 rounded-lg font-medium data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent"
                              >
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                                <ChevronRight
                                  className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                                    isOpen ? "rotate-90" : ""
                                  }`}
                                />
                              </SidebarMenuButton>
                              {isOpen && (
                                <SidebarMenuSub className="mt-1 ml-4 pl-3 border-l-2 border-border">
                                  {item.children?.map(child => (
                                    <SidebarMenuSubItem key={child.title}>
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={pathname === child.href}
                                        className="h-9 rounded-lg data-[active=true]:text-primary data-[active=true]:font-semibold"
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
                              className="h-11 rounded-lg font-medium data-[active=true]:bg-primary data-[active=true]:text-primary-foreground hover:bg-accent"
                            >
                              <Link href={item.href}>
                                <item.icon className="h-5 w-5" />
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
                <h1 className="text-lg font-semibold hidden sm:block">
                  Partner Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <ThemeToggle />
                <Link href="/partner/notifications">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive flex items-center justify-center text-[10px] text-white font-bold">
                      3
                    </span>
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        {user?.partner?.profileImage ? (
                          <AvatarImage
                            src={user.partner.profileImage}
                            alt={user.partner.partnerName}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user?.partner?.partnerName?.charAt(0) || "P"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.partner?.partnerName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <SubscriptionDialog 
        isOpen={showSubscriptionDialog} 
        onClose={handleCloseDialog} 
      />
    </ProtectedRoute>
  );
}
