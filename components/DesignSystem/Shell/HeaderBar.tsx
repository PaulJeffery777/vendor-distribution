'use client';

import React, { useState } from 'react';
import { ThemeIcon, Title, Paper, UnstyledButton, Popover } from '@mantine/core';
import { Inline } from '../Layout/Inline';
import { Stack } from '../Layout/Stack';
import { Box } from '../Layout/Box';
import { Text } from '../Typography/Text';

export interface DSHeaderBarProps {
  /** Application or prototype title shown in the header */
  title?: string;
}

// ============================= APP SWITCHER DATA =============================

interface AppSwitcherItem {
  label: string;
  description?: string;
  icon: string;
  active?: boolean;
  href?: string;
}

interface AppSwitcherSection {
  title?: string;
  items: AppSwitcherItem[];
}

const APP_SWITCHER_SECTIONS: AppSwitcherSection[] = [
  {
    items: [
      { label: 'Vendor Portal', description: 'Create products', icon: 'ri-code-s-slash-line', href: '/' },
      { label: 'Team', description: 'Govern users and roles', icon: 'ri-team-line' },
    ],
  },
  {
    items: [
      { label: 'Distribution', description: 'Product Distribution Channels', icon: 'ri-swap-3-line', href: '/distribution/sales-channels' },
      { label: 'Hyperscalers', description: 'Accelerate Cloud GTM', icon: 'ri-cloud-line' },
      { label: 'Partnerships', description: 'Grow partner revenue', icon: 'ri-group-2-line' },
      { label: 'Partner Programs', description: 'Earn program commissions', icon: 'ri-award-line' },
    ],
  },
  {
    title: 'LEARNING AND SUPPORT',
    items: [
      { label: 'Academy', icon: 'ri-book-open-line' },
      { label: 'Documentation Center', icon: 'ri-file-text-line' },
      { label: 'Developer Portal', icon: 'ri-tools-line' },
      { label: 'Support', icon: 'ri-customer-service-2-line' },
    ],
  },
  {
    title: 'MY APPS',
    items: [
      { label: 'Workday', icon: 'ri-briefcase-line' },
      { label: '15Five', icon: 'ri-star-line' },
      { label: 'Concur', icon: 'ri-wallet-3-line' },
      { label: 'Salesforce', icon: 'ri-cloud-line' },
    ],
  },
];

// ============================= APP SWITCHER MENU ITEM =======================

function AppSwitcherMenuItem({ item }: { item: AppSwitcherItem }) {
  const [hovered, setHovered] = useState(false);
  const showDetail = hovered;

  return (
    <UnstyledButton
      component={item.href ? 'a' : 'button'}
      href={item.href}
      w="100%"
      px="md"
      py="xs"
      bg={showDetail ? 'var(--mantine-color-gray-0)' : 'white'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <ThemeIcon variant="default" size={28} radius="sm" color="gray" style={{ flexShrink: 0 }}>
        <i className={item.icon} style={{ fontSize: 16 }} />
      </ThemeIcon>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text fz={14} fw={700} lh={1.5}>{item.label}</Text>
        {item.description && (
          <Text fz={12} fw={400} c="dimmed" lh={1.16} style={{ opacity: showDetail ? 1 : 0 }}>{item.description}</Text>
        )}
      </Box>
    </UnstyledButton>
  );
}

// ============================= APP SWITCHER MENU =============================

function AppSwitcherMenu() {
  return (
    <Paper shadow="md" radius="md" p={0} bg="white" w={264} style={{ overflow: 'hidden' }}>
      {/* Header */}
      <Box px="md" py="sm" style={{ height: 50, display: 'flex', alignItems: 'center' }}>
        <Text fw={700} fz={16}>Switch to</Text>
      </Box>

      {/* Sections */}
      <Stack gap={12} pb={0}>
        {APP_SWITCHER_SECTIONS.map((section, sIdx) => (
          <Box key={sIdx}>
            {section.title && (
              <Box px="md" py={5}>
                <Text fz={12} fw={500} c="dimmed" style={{ letterSpacing: '0.02em' }}>
                  {section.title}
                </Text>
              </Box>
            )}
            {section.items.map((item) => (
              <AppSwitcherMenuItem key={item.label} item={item} />
            ))}
          </Box>
        ))}
      </Stack>

      {/* Footer — View more apps */}
      <UnstyledButton
        w="100%"
        px="md"
        py="xs"
        bg="white"
        style={{
          borderTop: '1px solid var(--mantine-color-gray-3)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <ThemeIcon variant="default" size={28} radius="sm" color="gray">
          <i className="ri-arrow-right-double-line" style={{ fontSize: 16 }} />
        </ThemeIcon>
        <Text fz={14} fw={700} lh={1.5}>View more apps</Text>
      </UnstyledButton>
    </Paper>
  );
}

// ============================= HEADER BAR =============================

export function HeaderBar({ title = 'Prototype' }: DSHeaderBarProps) {
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);

  return (
    <Inline h="100%" px="xl" gap="lg">
      <Popover
        opened={appSwitcherOpen}
        onChange={setAppSwitcherOpen}
        position="bottom-start"
        offset={20}
        shadow="md"
        withinPortal
      >
        <Popover.Target>
          <UnstyledButton
            onClick={() => setAppSwitcherOpen((o) => !o)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ThemeIcon variant="transparent" size="lg" color="white">
              <i className="ri-grid-fill" style={{ fontSize: 28 }} />
            </ThemeIcon>
          </UnstyledButton>
        </Popover.Target>
        <Popover.Dropdown p={0} bg="transparent" bd="none" style={{ border: 'none', background: 'transparent' }}>
          <AppSwitcherMenu />
        </Popover.Dropdown>
      </Popover>

      <ThemeIcon variant="transparent" p="xs" size={48}>
        <img src="/assets/AppDirect-Mark_White.svg" alt="Logo" width={38} height={38} />
      </ThemeIcon>
      <Title order={1} c="white" fw={300} fz={22} ml={12}>
        {title}
      </Title>
    </Inline>
  );
}

HeaderBar.displayName = 'HeaderBar';
