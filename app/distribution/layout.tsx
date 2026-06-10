'use client';

import { ReactNode, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { AppShellLayout, type NavItem } from '@/components/DesignSystem';

const NAV_ITEMS: NavItem[] = [
  { label: 'Sales Channels', icon: 'ri-line-chart-line', href: '/distribution/sales-channels' },
  { label: 'Listings', icon: 'ri-list-check-2', href: '/distribution/listings' },
  { label: 'Orders', icon: 'ri-clipboard-line', href: '/distribution/orders' },
  { label: 'Revenue', icon: 'ri-money-dollar-circle-line', href: '/distribution/revenue' },
  { label: 'Payouts', icon: 'ri-hand-coin-line', href: '/distribution/payouts' },
];

export default function DistributionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const navItems = useMemo(
    () => NAV_ITEMS.map((item) => ({ ...item, active: pathname === item.href })),
    [pathname],
  );

  return (
    <AppShellLayout navItems={navItems} title="Distribution" titleIcon="ri-swap-3-line">
      {children}
    </AppShellLayout>
  );
}
