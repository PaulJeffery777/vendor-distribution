'use client';

import React, { forwardRef } from 'react';
import { Group, Text } from '@mantine/core';

export type StatusGemTone = 'info' | 'success' | 'pending' | 'danger' | 'neutral';

export interface DSStatusGemProps {
  tone: StatusGemTone;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md';
}

const TONE_COLORS: Record<StatusGemTone, string> = {
  info:    '#326FDE',
  success: '#40c057',
  pending: '#fab005',
  danger:  '#fa5252',
  neutral: 'var(--ad-color-text-dimmed)',
};

export const StatusGem = forwardRef<HTMLDivElement, DSStatusGemProps>(
  ({ tone, children, size = 'sm' }, ref) => (
    <Group ref={ref} gap={6} wrap="nowrap" align="center">
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: TONE_COLORS[tone],
          flexShrink: 0,
        }}
      />
      <Text size={size} fw={500} style={{ whiteSpace: 'nowrap' }}>
        {children}
      </Text>
    </Group>
  )
);

StatusGem.displayName = 'StatusGem';
