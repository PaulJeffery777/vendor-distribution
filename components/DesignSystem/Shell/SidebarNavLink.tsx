import React from 'react';
import { NavLink as MantineNavLink, Text, ThemeIcon } from '@mantine/core';

const level01Styles = {
  root: {
    height: 44,
    paddingLeft: 'var(--mantine-spacing-xs)',
    borderTopLeftRadius: 'var(--mantine-radius-sm)',
    borderBottomLeftRadius: 'var(--mantine-radius-sm)',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
};

const level02Styles = {
  root: {
    height: 30,
    paddingLeft: 'var(--mantine-spacing-xl)',
    borderTopLeftRadius: 'var(--mantine-radius-sm)',
    borderBottomLeftRadius: 'var(--mantine-radius-sm)',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
};

const sectionChildStyles = {
  root: {
    height: 30,
    paddingLeft: 52,
    borderTopLeftRadius: 'var(--mantine-radius-sm)',
    borderBottomLeftRadius: 'var(--mantine-radius-sm)',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
};

export interface DSSidebarNavLinkProps {
  label: string;
  icon?: string;
  href?: string;
  active?: boolean;
  color?: string;
  rightSection?: React.ReactNode;
  /** Collapsible child nav items (renders as accordion group) */
  children?: DSSidebarNavLinkProps[];
  /** 'section-label' renders as uppercase category header (e.g. BILLING) */
  type?: 'item' | 'section-label';
}

export function SidebarNavLink({
  label,
  icon,
  href,
  active,
  color = 'dark',
  rightSection,
  children,
  type = 'item',
}: DSSidebarNavLinkProps) {
  if (type === 'section-label') {
    return (
      <>
        <Text
          size="sm"
          fw={700}
          c="dimmed"
          tt="uppercase"
          pl={52}
          pt="md"
          pb="xs"
          style={{ letterSpacing: '-0.42px' }}
        >
          {label}
        </Text>
        {children?.map((child) => (
          <MantineNavLink
            key={child.label}
            component="a"
            href={child.href ?? '#'}
            label={child.label}
            active={child.active}
            aria-current={child.active ? 'page' : undefined}
            styles={sectionChildStyles}
          />
        ))}
      </>
    );
  }

  const leftSection = icon ? (
    <ThemeIcon variant="transparent" size="md" color={color}>
      <i className={icon} style={{ fontSize: 20 }} />
    </ThemeIcon>
  ) : undefined;

  if (children && children.length > 0) {
    return (
      <MantineNavLink
        label={label}
        leftSection={leftSection}
        active={active}
        defaultOpened
        styles={level01Styles}
      >
        {children.map((child) => (
          <MantineNavLink
            key={child.label}
            component="a"
            href={child.href ?? '#'}
            label={child.label}
            active={child.active}
            aria-current={child.active ? 'page' : undefined}
            styles={level02Styles}
          />
        ))}
      </MantineNavLink>
    );
  }

  return (
    <MantineNavLink
      component="a"
      href={href ?? '#'}
      label={label}
      leftSection={leftSection}
      rightSection={rightSection}
      active={active}
      aria-current={active ? 'page' : undefined}
      styles={level01Styles}
    />
  );
}

SidebarNavLink.displayName = 'SidebarNavLink';
