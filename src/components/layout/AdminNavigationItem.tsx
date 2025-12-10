'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';

interface NavigationItemProps {
  item: {
    title: string;
    icon: LucideIcon;
    href: string;
  };
}

/**
 * Navigation item component that handles search params
 * Wrapped in Suspense boundary by parent
 */
export function AdminNavigationItem({ item }: NavigationItemProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if active:
  // 1. Exact match of href (including query params if any)
  // 2. OR pathname match if item has no query params
  const isPartnersLink = item.href.includes('?');
  const currentQuery = searchParams.toString();
  const fullPath = currentQuery ? `${pathname}?${currentQuery}` : pathname;
  
  const isActive = isPartnersLink 
    ? fullPath === item.href
    : pathname === item.href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
