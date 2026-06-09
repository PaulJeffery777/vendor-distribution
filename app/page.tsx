'use client';

import {
  AppShellLayout,
  type NavItem,
} from '@/components/DesignSystem';

const navItems: NavItem[] = [
  { label: 'Home', icon: 'ri-home-4-line', href: '/', active: true },
  {
    label: 'Operations',
    icon: 'ri-group-line',
    children: [
      { label: 'Users', href: '#' },
      { label: 'Companies', href: '#' },
      { label: 'Integration Events', href: '#' },
    ],
  },
  {
    label: 'Billing',
    type: 'section-label',
    children: [
      { label: 'Orders', href: '#' },
      { label: 'Subscriptions', href: '#' },
      { label: 'Revenue', href: '/prototype/revenue' },
      { label: 'Payouts', href: '/prototype/payouts' },
    ],
  },
  {
    label: 'Products',
    icon: 'ri-apps-2-line',
    children: [
      { label: 'Product Catalog', href: '#' },
      { label: 'Product Uploader', href: '#' },
    ],
  },
  {
    label: 'Settings',
    icon: 'ri-settings-3-line',
    children: [
      { label: 'Webhooks', href: '#' },
      { label: 'Functions', href: '#' },
    ],
  },
  {
    label: 'Reports',
    icon: 'ri-bar-chart-box-line',
    children: [
      { label: 'Download Reports', href: '#' },
      { label: 'Manage Scheduled Reports', href: '#' },
      { label: 'Create Reports', href: '#' },
    ],
  },
];

export default function HomePage() {
  return (
    <AppShellLayout navItems={navItems} title="Vendor Portal">
      <img src="/assets/Developer_Dashboard.png" alt="Developer Dashboard" />
    </AppShellLayout>
  );
}
