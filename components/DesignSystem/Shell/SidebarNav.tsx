import React from 'react';
import { ThemeIcon, Divider, Title } from '@mantine/core';
import { Inline } from '../Layout/Inline';
import { SidebarNavLink, type DSSidebarNavLinkProps } from './SidebarNavLink';

export type NavItem = DSSidebarNavLinkProps;

export interface DSSidebarNavProps {
  navItems: NavItem[];
  title: string;
  /** Remix icon class for the title area (default: ri-code-s-slash-line) */
  titleIcon?: string;
}

export function SidebarNav({ navItems, title, titleIcon = 'ri-code-s-slash-line' }: DSSidebarNavProps) {
  return (
    <nav aria-label="Sidebar Navigation">
      <Inline align="center" gap="sm" mb={0} h={66} pl="xs">
        <ThemeIcon variant="transparent" size="lg" color="dark">
          <i className={titleIcon} style={{ fontSize: 28 }} />
        </ThemeIcon>
        <Title order={5} fw={700} m={0}>
          {title}
        </Title>
      </Inline>
      <Divider mb="md" />
      {navItems.map((item) => (
        <SidebarNavLink key={item.label} {...item} />
      ))}
    </nav>
  );
}

SidebarNav.displayName = 'SidebarNav';
