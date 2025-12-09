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
import { Avatar } from '@/components/ui/avatar';

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

  const getInitials = () => {
    if (user?.member) {
      return `${user.member.firstName.charAt(0)}${user.member.lastName.charAt(0)}`;
    }
    if (user?.partner) {
      return user.partner.partnerName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getProfileImage = () => {
    if (user?.member?.profilePicture) return user.member.profilePicture;
    if (user?.partner?.profileImage) return user.partner.profileImage;
    return null;
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
                      <Button variant="ghost" className="flex items-center gap-2 pl-0 pr-2 rounded-full">
                        <Avatar
                          className="h-9 w-9"
                          src={getProfileImage()}
                          alt={getDisplayName()}
                          fallback={getInitials()}
                        />
                        <span className="hidden sm:inline font-medium">{getDisplayName()}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push(getRolePath())}>
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
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
