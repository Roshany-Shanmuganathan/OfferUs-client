'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoginModal } from '@/components/auth/LoginModal';
import { MemberRegisterModal } from '@/components/auth/MemberRegisterModal';
import { User, LogOut, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [memberRegisterOpen, setMemberRegisterOpen] = useState(false);
  const router = useRouter();

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
    return user?.email || 'User';
  };

  const getRolePath = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'partner') return '/partner';
    if (user?.role === 'member') return '/member';
    return '/';
  };

  const getProfilePath = () => {
    if (user?.role === 'admin') return '/admin/settings';
    if (user?.role === 'partner') return '/partner/settings';
    if (user?.role === 'member') return '/member/profile';
    return '/';
  };

  const getProfileImageUrl = () => {
    if (user?.member?.profilePicture) {
      const url = user.member.profilePicture;
      // Check if it's already a full URL (Cloudinary URL)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Otherwise, it's a relative path (legacy local file)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${apiUrl}${url}`;
    }
    if (user?.partner?.profileImage) {
      const url = user.partner.profileImage;
      // Check if it's already a full URL (Cloudinary URL)
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      // Otherwise, it's a relative path (legacy local file)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${apiUrl}${url}`;
    }
    return null;
  };

  const getInitials = () => {
    if (user?.member) {
      return `${user.member.firstName?.[0] || ''}${user.member.lastName?.[0] || ''}`.toUpperCase();
    }
    if (user?.partner) {
      return user.partner.partnerName?.[0]?.toUpperCase() || 'P';
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold">
                OfferUs
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Home
                </Link>
                <Link
                  href="/offers"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Offers
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        {getProfileImageUrl() ? (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                            <Image
                              src={getProfileImageUrl()!}
                              alt={getDisplayName()}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                            {getInitials()}
                          </div>
                        )}
                        <span className="hidden sm:inline">{getDisplayName()}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(getRolePath())}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push(getProfilePath())}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setLoginOpen(true)}
                    className="hidden sm:inline-flex"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setMemberRegisterOpen(true)}
                    className="hidden sm:inline-flex"
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => router.push('/partner/register')}
                    className="hidden sm:inline-flex"
                  >
                    Join as Partner
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setLoginOpen(true)}>
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setMemberRegisterOpen(true)}>
                        Sign Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/partner/register')}>
                        Join as Partner
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      <MemberRegisterModal
        open={memberRegisterOpen}
        onOpenChange={setMemberRegisterOpen}
      />
    </>
  );
}

