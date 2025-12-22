"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  User,
  LogOut,
  Menu,
  ShoppingCart,
  X,
  Home,
  Tag,
  Info,
  Phone,
  ChevronRight,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSavedOffers } from "@/contexts/SavedOffersContext";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberNotificationBell } from "@/components/member/MemberNotificationBell";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavSearchBar } from "./NavSearchBar";

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { count } = useSavedOffers();
  const [authModal, setAuthModal] = useState<{ open: boolean; view: "login" | "register" }>({
    open: false,
    view: "login",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const getDisplayName = () => {
    if (user?.member) {
      return `${user.member.firstName} ${user.member.lastName}`;
    }
    if (user?.partner) {
      return user.partner.partnerName;
    }
    return user?.email || "User";
  };

  const getRolePath = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "partner") return "/partner";
    if (user?.role === "member") return "/member";
    return "/";
  };

  const getInitials = () => {
    if (user?.member) {
      return `${user.member.firstName.charAt(0)}${user.member.lastName.charAt(
        0
      )}`;
    }
    if (user?.partner) {
      return user.partner.partnerName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  const getProfileImage = () => {
    if (user?.member?.profilePicture) return user.member.profilePicture;
    if (user?.partner?.profileImage) return user.partner.profileImage;
    return null;
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/offers", label: "Offers", icon: Tag },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center">
                <Logo width={110} height={36} />
              </Link>
            </div>

            {/* Desktop Navigation - Replaced with Search Bar */}
            <div className="hidden lg:flex flex-1 items-center justify-center max-w-xl mx-auto px-4">
              <NavSearchBar className="hidden lg:block" />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  {user?.role === "member" && (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MemberNotificationBell />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 sm:h-10 sm:w-10"
                        onClick={() => router.push("/saved-offers")}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        {count > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                      </Button>
                    </div>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
                      >
                        <Avatar className="h-9 w-9">
                          {getProfileImage() && (
                            <AvatarImage
                              src={getProfileImage() || undefined}
                              alt={getDisplayName()}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                            {getInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {getProfileImage() && (
                              <AvatarImage
                                src={getProfileImage() || undefined}
                              />
                            )}
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-0.5">
                            <p className="text-sm font-semibold">
                              {getDisplayName()}
                            </p>
                            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => router.push(getRolePath())}
                        className="cursor-pointer py-2.5"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/profile")}
                        className="cursor-pointer py-2.5"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer py-2.5 text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  {/* Desktop Auth Buttons */}
                  <div className="hidden lg:flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setAuthModal({ open: true, view: "login" })}
                      className="font-medium"
                      suppressHydrationWarning
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAuthModal({ open: true, view: "register" })}
                      className="font-medium"
                      suppressHydrationWarning
                    >
                      Sign Up
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => router.push("/partner/register")}
                      className="font-medium shadow-sm"
                      suppressHydrationWarning
                    >
                      Join as Partner
                    </Button>
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9"
                    suppressHydrationWarning
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 p-0">
                  <SheetHeader className="p-6 border-b">
                    <SheetTitle className="flex items-center justify-between">
                      <Logo width={100} height={32} />
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col h-[calc(100%-80px)]">
                    {/* Theme Toggle in Mobile */}
                    <div className="px-4 pt-4 pb-2 border-b">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          Theme
                        </span>
                        <ThemeToggle />
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 p-4 space-y-1">
                      {navLinks.map(link => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                              isActiveLink(link.href)
                                ? "bg-primary text-primary-foreground"
                                : "text-foreground hover:bg-accent"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            {link.label}
                            <ChevronRight className="h-4 w-4 ml-auto opacity-50" />
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Auth Actions in Mobile Menu */}
                    {!isAuthenticated && (
                      <div className="p-4 border-t space-y-3">
                        <Button
                          variant="default"
                          className="w-full h-12 text-base font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setAuthModal({ open: true, view: "login" });
                          }}
                          suppressHydrationWarning
                        >
                          <LogIn className="mr-2 h-5 w-5" />
                          Sign In
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full h-12 text-base font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setAuthModal({ open: true, view: "register" });
                          }}
                          suppressHydrationWarning
                        >
                          <UserPlus className="mr-2 h-5 w-5" />
                          Sign Up
                        </Button>
                        <Button
                          variant="secondary"
                          className="w-full h-12 text-base font-medium"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            router.push("/partner/register");
                          }}
                          suppressHydrationWarning
                        >
                          Join as Partner
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="lg:hidden w-full pb-4">
            <NavSearchBar />
          </div>
        </div>
      </nav>

      <AuthModal
        open={authModal.open}
        defaultView={authModal.view}
        onOpenChange={(open) => setAuthModal(prev => ({ ...prev, open }))}
      />
    </>
  );
}
