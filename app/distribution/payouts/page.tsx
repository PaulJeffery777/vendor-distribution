'use client';

import { useState, useMemo } from 'react';
import { DatePickerInput } from '@mantine/dates';
import {
  Badge,
  Button,
  ActionIcon,
  Drawer,
  Modal,
  Stack,
  Inline,
  Box,
  Flex,
  SimpleGrid,
  Text,
  Title,
  TextInput,
  Select,
  Table,
  Breadcrumb,
  Divider,
} from '@/components/DesignSystem';

// ============================= TYPES =============================

interface Marketplace {
  id: string;
  name: string;
  short: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  unitPrice: number;
}

interface LineItem extends Product {
  seats: number;
  newSubs: number;
  churned: number;
  gross: number;
}

type StatementStatus = 'accruing' | 'ready' | 'submitted' | 'paid' | 'disputed';

interface Statement {
  id: string;
  period: { start: Date; end: Date };
  marketplace: Marketplace;
  status: StatementStatus;
  gross: number;
  fee: number;
  net: number;
  currency: string;
  invoice: string | null;
  submittedDate: Date | null;
  paidDate: Date | null;
  dueDate: Date | null;
  lineItems: LineItem[];
}

interface DateRange {
  start: Date;
  end: Date;
  presetId?: string;
  label?: string;
}

type BadgeColor = 'info' | 'success' | 'danger' | 'pending' | 'default';

interface StatusConfig {
  label: string;
  badge: BadgeColor;
  desc: string;
}

interface SortState {
  key: 'period' | 'net' | 'submitted' | 'paid' | 'status';
  dir: 'asc' | 'desc';
}

// ============================= CONSTANTS =============================

const TODAY = new Date('2026-04-28');

const VENDOR = {
  name: 'Northbeam Analytics',
  rev_share: 0.85,
};

const MARKETPLACES: Marketplace[] = [
  { id: 'mp_acme',  name: 'Acme Cloud Marketplace',  short: 'Acme' },
  { id: 'mp_telco', name: 'Veridian Telco Apps',     short: 'Veridian' },
  { id: 'mp_fed',   name: 'Federated Workforce Hub', short: 'Federated' },
  { id: 'mp_orbit', name: 'Orbit ISV Network',       short: 'Orbit' },
];

const PRODUCTS: Product[] = [
  { id: 'p_pro',  name: 'Northbeam Pro',        sku: 'NB-PRO',  unitPrice: 49 },
  { id: 'p_team', name: 'Northbeam Team',       sku: 'NB-TEAM', unitPrice: 99 },
  { id: 'p_ent',  name: 'Northbeam Enterprise', sku: 'NB-ENT',  unitPrice: 249 },
  { id: 'p_addon',name: 'Attribution Add-on',   sku: 'NB-ATTR', unitPrice: 29 },
];

const STATUS_PILL_COLORS: Record<StatementStatus, { fg: string; border: string }> = {
  accruing:  { fg: '#868e96', border: '#ced4da' },
  ready:     { fg: '#1971c2', border: '#74c0fc' },
  submitted: { fg: '#b28600', border: '#ffd43b' },
  paid:      { fg: '#2f9e44', border: '#8ce99a' },
  disputed:  { fg: '#c92a2a', border: '#ffa8a8' },
};

const STATUS_CONFIG: Record<StatementStatus, StatusConfig> = {
  accruing:  { label: 'Accruing',   badge: 'default',  desc: 'Period in progress' },
  ready:     { label: 'Ready',      badge: 'info',     desc: 'Statement finalized, awaiting your invoice' },
  submitted: { label: 'Submitted',  badge: 'pending',  desc: 'Awaiting AppDirect payment' },
  paid:      { label: 'Paid',       badge: 'success',  desc: 'Funds disbursed' },
  disputed:  { label: 'Disputed',   badge: 'danger',   desc: 'Action required' },
};

const DATE_PRESETS = [
  { value: 'last30',  label: 'Last 30 days' },
  { value: 'mtd',     label: 'This month' },
  { value: 'lastM',   label: 'Last month' },
  { value: 'qtd',     label: 'This quarter' },
  { value: 'lastQ',   label: 'Last quarter' },
  { value: 'ytd',     label: 'Year to date' },
  { value: 'all',     label: 'All time' },
];

// ============================= HELPERS =============================

function fmtUSD(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function fmtDate(
  d: Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' },
): string {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', opts);
}

function fmtDateShort(d: Date): string {
  return fmtDate(d, { month: 'short', day: 'numeric' });
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function getPresetRange(presetId: string): DateRange | null {
  const q = Math.floor(TODAY.getMonth() / 3);
  switch (presetId) {
    case 'last30': return { start: addDays(TODAY, -30), end: TODAY };
    case 'mtd':    return { start: new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), end: TODAY };
    case 'lastM':  return { start: new Date(TODAY.getFullYear(), TODAY.getMonth() - 1, 1), end: new Date(TODAY.getFullYear(), TODAY.getMonth(), 0) };
    case 'qtd':    return { start: new Date(TODAY.getFullYear(), q * 3, 1), end: TODAY };
    case 'lastQ':  return { start: new Date(TODAY.getFullYear(), (q - 1) * 3, 1), end: new Date(TODAY.getFullYear(), q * 3, 0) };
    case 'ytd':    return { start: new Date(TODAY.getFullYear(), 0, 1), end: TODAY };
    case 'all':    return { start: new Date(TODAY.getFullYear() - 3, 0, 1), end: TODAY };
    default:       return null;
  }
}

function filterByRange(statements: Statement[], range: DateRange): Statement[] {
  const rangeEnd = range.end.getTime() + 86400000 - 1;
  return statements.filter(s => {
    const ps = s.period.start.getTime();
    const pe = s.period.end.getTime();
    return ps <= rangeEnd && pe >= range.start.getTime();
  });
}

// ============================= MOCK DATA GENERATION =============================

function generateStatements(): Statement[] {
  const out: Statement[] = [];
  const months: Date[] = [];
  for (let i = 17; i >= 0; i--) {
    months.push(new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1));
  }

  let stmtSeq = 1042;
  let invoiceSeq = 2310;

  months.forEach((monthStart, mi) => {
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const isCurrent = monthStart.getFullYear() === TODAY.getFullYear() && monthStart.getMonth() === TODAY.getMonth();
    const monthsAgo = months.length - 1 - mi;

    MARKETPLACES.forEach((mp, mpi) => {
      if (mp.id === 'mp_orbit' && mi < 6) return;
      if (mp.id === 'mp_fed' && mi < 3) return;

      const growth = 1 + mi * 0.03;
      const mpScale = mp.id === 'mp_acme' ? 1.0 : mp.id === 'mp_telco' ? 0.7 : mp.id === 'mp_fed' ? 0.5 : 0.35;
      const jitter = 0.85 + ((mi * 7 + mpi * 13) % 10) / 33;

      const lineItems: LineItem[] = PRODUCTS.map((p, pi) => {
        const seatBase = p.id === 'p_pro' ? 180 : p.id === 'p_team' ? 95 : p.id === 'p_ent' ? 22 : 140;
        const seats = Math.max(0, Math.round(seatBase * mpScale * growth * jitter * (0.7 + pi * 0.1)));
        const newSubs = Math.round(seats * 0.08);
        const churned = Math.round(seats * 0.04);
        const gross = seats * p.unitPrice;
        return { ...p, seats, newSubs, churned, gross };
      }).filter(li => li.seats > 0);

      const gross = lineItems.reduce((s, li) => s + li.gross, 0);
      const fee = Math.round(gross * (1 - VENDOR.rev_share) * 100) / 100;
      const net = Math.round((gross - fee) * 100) / 100;

      let status: StatementStatus;
      let invoice: string | null = null;
      let submittedDate: Date | null = null;
      let paidDate: Date | null = null;
      let dueDate: Date | null = null;

      if (isCurrent) {
        status = 'accruing';
      } else if (monthsAgo === 1) {
        status = 'ready';
      } else if (monthsAgo === 2) {
        status = 'submitted';
        invoice = `INV-${invoiceSeq++}`;
        submittedDate = new Date(TODAY.getFullYear(), TODAY.getMonth(), 6 + (mpi % 5));
        dueDate = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 6 + (mpi % 5));
      } else if (monthsAgo === 3 && (mp.id === 'mp_telco' || mp.id === 'mp_acme')) {
        status = 'submitted';
        invoice = `INV-${invoiceSeq++}`;
        submittedDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 7);
        dueDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 2, 7);
      } else if (monthsAgo === 4 && mp.id === 'mp_fed') {
        status = 'disputed';
        invoice = `INV-${invoiceSeq++}`;
        submittedDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 4);
      } else if (monthsAgo === 6 && mp.id === 'mp_orbit') {
        status = 'disputed';
        invoice = `INV-${invoiceSeq++}`;
        submittedDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 6);
      } else {
        status = 'paid';
        invoice = `INV-${invoiceSeq++}`;
        submittedDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 5);
        paidDate = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 22);
      }

      out.push({
        id: `STMT-${stmtSeq++}`,
        period: { start: monthStart, end: monthEnd },
        marketplace: mp,
        status,
        gross,
        fee,
        net,
        currency: 'USD',
        invoice,
        submittedDate,
        paidDate,
        dueDate,
        lineItems,
      });
    });
  });

  return out.reverse();
}

const STATEMENTS = generateStatements();

// ============================= FILTER KPI CARD =============================

interface FilterKPICardProps {
  label: string;
  icon: string;
  tone: 'primary' | 'pending' | 'success' | 'neutral';
  amount: number;
  count: number;
  countLabel: string;
  active: boolean;
  highlight?: boolean;
  onClick: () => void;
}

function FilterKPICard({ label, icon, tone, amount, count, countLabel, active, highlight, onClick }: FilterKPICardProps) {
  const [hovered, setHovered] = useState(false);

  const tones = {
    primary: { fg: '#326FDE', bg: 'rgba(50,111,222,0.1)' },
    pending: { fg: '#f59f00', bg: 'rgba(250,176,5,0.12)' },
    success: { fg: '#2f9e44', bg: 'rgba(64,192,87,0.12)' },
    neutral: { fg: 'var(--mantine-color-gray-7)', bg: 'var(--mantine-color-gray-1)' },
  };
  const t = tones[tone];

  let borderColor = 'var(--mantine-color-gray-3)';
  let boxShadow = 'var(--mantine-shadow-xs)';
  let bgColor = '#fff';

  if (active) {
    borderColor = t.fg;
    boxShadow = `0 0 0 3px ${t.fg}1f, var(--mantine-shadow-xs)`;
  } else if (highlight) {
    borderColor = 'rgba(50,111,222,0.4)';
    boxShadow = '0 0 0 3px rgba(50,111,222,0.06), var(--mantine-shadow-xs)';
  } else if (hovered) {
    borderColor = 'var(--mantine-color-gray-4)';
    boxShadow = 'var(--mantine-shadow-sm)';
    bgColor = 'var(--mantine-color-gray-0)';
  }

  return (
    <Box
      component="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        padding: 16,
        boxShadow,
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        minHeight: 116,
        transition: 'box-shadow 120ms, border-color 120ms, background 120ms',
        position: 'relative',
        width: '100%',
      }}
    >
      {active && (
        <Text
          size="xs"
          fw={700}
          tt="uppercase"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            color: t.fg,
            letterSpacing: '0.06em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="ri-filter-fill" style={{ fontSize: 11 }} />
          Active
        </Text>
      )}
      <Inline gap="xs" align="center">
        <Box
          style={{
            width: 28,
            height: 28,
            borderRadius: 4,
            background: t.bg,
            color: t.fg,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <i className={icon} style={{ fontSize: 15 }} />
        </Box>
        <Text size="sm" fw={600} c="dimmed">{label}</Text>
      </Inline>
      <Text
        fw={700}
        ff="monospace"
        fz={34}
        style={{ color: 'var(--mantine-color-gray-9)', lineHeight: 1.1, marginTop: 4, letterSpacing: '-0.01em' }}
      >
        {fmtUSD(amount)}
      </Text>
      <Text size="xs" c="dimmed">
        {count} {countLabel}{count === 1 ? '' : 's'}
      </Text>
    </Box>
  );
}

// ============================= SORT HEADER =============================

interface SortHeaderProps {
  label: string;
  sortKey: SortState['key'];
  sortBy: SortState;
  onSort: (key: SortState['key']) => void;
  align?: 'left' | 'right';
}

function SortHeader({ label, sortKey, sortBy, onSort, align = 'left' }: SortHeaderProps) {
  const active = sortBy.key === sortKey;
  return (
    <Table.Th
      style={{ textAlign: align, cursor: 'pointer', whiteSpace: 'nowrap' }}
      onClick={() => onSort(sortKey)}
    >
      <Inline gap={4} align="center" justify={align === 'right' ? 'flex-end' : 'flex-start'}>
        <Text size="xs" fw={600} tt="uppercase" c={active ? 'dark' : 'dimmed'} style={{ letterSpacing: '0.06em' }}>
          {label}
        </Text>
        <i
          className={active ? (sortBy.dir === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line') : 'ri-expand-up-down-line'}
          style={{ fontSize: 12, opacity: active ? 1 : 0.5, color: active ? 'var(--mantine-color-gray-9)' : undefined }}
        />
      </Inline>
    </Table.Th>
  );
}

// ============================= STATEMENT ROW =============================

interface StatementRowProps {
  stmt: Statement;
  onOpen: () => void;
  onInvoice: () => void;
}

function StatementRow({ stmt, onOpen, onInvoice }: StatementRowProps) {
  const cfg = STATUS_CONFIG[stmt.status];
  const [hovered, setHovered] = useState(false);

  return (
    <Table.Tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      style={{ background: hovered ? 'var(--mantine-color-gray-0)' : '#fff', cursor: 'pointer' }}
    >
      {/* Period + marketplace short name */}
      <Table.Td style={{ whiteSpace: 'nowrap' }}>
        <Text fw={600} size="sm">{fmtDate(stmt.period.start, { month: 'short', year: 'numeric' })}</Text>
        <Text size="xs" c="dimmed">{stmt.marketplace.short}</Text>
      </Table.Td>
      {/* Statement ID + optional invoice number */}
      <Table.Td style={{ whiteSpace: 'nowrap' }}>
        <Text ff="monospace" size="sm" c="dimmed">{stmt.id}</Text>
        {stmt.invoice && <Text size="xs" c="dimmed" ff="monospace">{stmt.invoice}</Text>}
      </Table.Td>
      <Table.Td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
        <Text ff="monospace" fw={600} size="sm">{fmtUSD(stmt.net)}</Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: 'nowrap' }}>
        {/* Inline pill: avoids Mantine Badge's overflow:hidden truncation in table cells */}
        <span style={{
          display: 'inline-block',
          padding: '3px 8px',
          borderRadius: 20,
          border: `1px solid ${STATUS_PILL_COLORS[stmt.status].border}`,
          color: STATUS_PILL_COLORS[stmt.status].fg,
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}>
          {cfg.label}
        </span>
      </Table.Td>
      <Table.Td style={{ whiteSpace: 'nowrap' }}>
        <Text size="sm" c={stmt.submittedDate ? 'dark' : 'dimmed'}>
          {stmt.submittedDate ? fmtDate(stmt.submittedDate) : '—'}
        </Text>
      </Table.Td>
      <Table.Td style={{ whiteSpace: 'nowrap' }}>
        {stmt.paidDate ? (
          <Text size="sm" fw={600} style={{ color: '#2f9e44' }}>{fmtDate(stmt.paidDate)}</Text>
        ) : (
          <Text size="sm" c="dimmed">—</Text>
        )}
      </Table.Td>
      {/* Action — icon for "view", text only for primary CTA */}
      <Table.Td
        style={{ textAlign: 'right', whiteSpace: 'nowrap' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
          {/* Eye icon opens drawer (same as row click, but explicit affordance) */}
          <ActionIcon variant="link" size="sm" onClick={onOpen} title="View statement">
            <i className="ri-eye-line" style={{ fontSize: 14 }} />
          </ActionIcon>
          {stmt.status === 'ready' && (
            <Button variant="primary" size="xs" onClick={(e) => { e.stopPropagation(); onInvoice(); }}>
              Create invoice
            </Button>
          )}
          {stmt.status === 'disputed' && (
            <Button variant="default" size="xs" onClick={(e) => e.stopPropagation()}>
              <i className="ri-error-warning-line" style={{ color: '#fa5252', marginRight: 4 }} />
              Resolve
            </Button>
          )}
        </div>
      </Table.Td>
    </Table.Tr>
  );
}

// ============================= SUMMARY CELL =============================

interface SummaryCellProps {
  label: string;
  value: React.ReactNode;
  sub: string;
  highlight?: boolean;
  last?: boolean;
}

function SummaryCell({ label, value, sub, highlight, last }: SummaryCellProps) {
  return (
    <Box
      style={{
        padding: 16,
        borderRight: last ? 'none' : '1px solid var(--mantine-color-gray-2)',
        background: highlight ? 'rgba(50,111,222,0.04)' : '#fff',
      }}
    >
      <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={6} style={{ letterSpacing: '0.06em' }}>
        {label}
      </Text>
      <Text
        fw={700}
        ff={typeof value === 'string' && value.includes('$') ? 'monospace' : undefined}
        style={{
          fontSize: 22,
          color: highlight ? '#326FDE' : 'var(--mantine-color-gray-9)',
          lineHeight: 1.2,
        }}
      >
        {value}
      </Text>
      <Text size="xs" c="dimmed" mt={2}>{sub}</Text>
    </Box>
  );
}

// ============================= TIMELINE =============================

interface TimelineEvent {
  icon: string;
  color: string;
  date: Date | null;
  label: string;
}

function StatementTimeline({ statement }: { statement: Statement }) {
  const events: TimelineEvent[] = [
    { icon: 'ri-flag-line', color: '#868e96', date: statement.period.end, label: 'Statement period closed' },
  ];
  if (statement.submittedDate) {
    events.push({ icon: 'ri-file-upload-line', color: '#fab005', date: statement.submittedDate, label: `Invoice ${statement.invoice} submitted to AppDirect` });
  }
  if (statement.paidDate) {
    events.push({ icon: 'ri-bank-card-line', color: '#40c057', date: statement.paidDate, label: `Funds disbursed · ${fmtUSD(statement.net)}` });
  }
  if (statement.status === 'disputed') {
    events.push({ icon: 'ri-error-warning-line', color: '#fa5252', date: statement.submittedDate ? addDays(statement.submittedDate, 3) : null, label: 'Marked for clarification — see notes' });
  }
  if (statement.status === 'ready') {
    events.push({ icon: 'ri-time-line', color: '#326FDE', date: TODAY, label: 'Ready for you to create an invoice' });
  }

  events.sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));

  return (
    <Stack gap={0}>
      {events.map((e, i) => (
        <Inline key={i} gap="sm" pb={i < events.length - 1 ? 'sm' : 0} style={{ position: 'relative' }}>
          {i < events.length - 1 && (
            <Box
              style={{
                position: 'absolute',
                left: 11,
                top: 22,
                bottom: 0,
                width: 1,
                background: 'var(--mantine-color-gray-2)',
              }}
            />
          )}
          <Box
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: `${e.color}22`,
              color: e.color,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className={e.icon} style={{ fontSize: 13 }} />
          </Box>
          <Box style={{ flex: 1 }}>
            <Text size="sm">{e.label}</Text>
            <Text size="xs" c="dimmed">{fmtDate(e.date)}</Text>
          </Box>
        </Inline>
      ))}
    </Stack>
  );
}

// ============================= PRODUCT BREAKDOWN TABLE =============================

function ProductBreakdownTable({ statement }: { statement: Statement }) {
  const items = statement.lineItems;
  return (
    <Table>
      <Table.Thead>
        <Table.Tr bg="gray.0">
          <Table.Th><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Product</Text></Table.Th>
          <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Active subs</Text></Table.Th>
          <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>New</Text></Table.Th>
          <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Churned</Text></Table.Th>
          <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Unit price</Text></Table.Th>
          <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Gross</Text></Table.Th>
          <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Net</Text></Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map(li => (
          <Table.Tr key={li.id}>
            <Table.Td>
              <Text fw={600} size="sm">{li.name}</Text>
              <Text size="xs" c="dimmed" ff="monospace">{li.sku}</Text>
            </Table.Td>
            <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm">{li.seats.toLocaleString()}</Text></Table.Td>
            <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm" style={{ color: '#2f9e44' }}>+{li.newSubs}</Text></Table.Td>
            <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm" style={{ color: '#e03131' }}>−{li.churned}</Text></Table.Td>
            <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm" c="dimmed">{fmtUSD(li.unitPrice, 2)}</Text></Table.Td>
            <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm">{fmtUSD(li.gross)}</Text></Table.Td>
            <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={600} size="sm">{fmtUSD(li.gross * VENDOR.rev_share)}</Text></Table.Td>
          </Table.Tr>
        ))}
        <Table.Tr bg="gray.0">
          <Table.Td fw={700}>Total</Table.Td>
          <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm">{items.reduce((s, li) => s + li.seats, 0).toLocaleString()}</Text></Table.Td>
          <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm" style={{ color: '#2f9e44' }}>+{items.reduce((s, li) => s + li.newSubs, 0)}</Text></Table.Td>
          <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm" style={{ color: '#e03131' }}>−{items.reduce((s, li) => s + li.churned, 0)}</Text></Table.Td>
          <Table.Td style={{ textAlign: 'right' }}>—</Table.Td>
          <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm">{fmtUSD(statement.gross)}</Text></Table.Td>
          <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm">{fmtUSD(statement.net)}</Text></Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}

// ============================= STATEMENT DETAIL CONTENT =============================

interface StatementDetailContentProps {
  statement: Statement;
  onCreateInvoice: (s: Statement) => void;
}

function StatementDetailContent({ statement, onCreateInvoice }: StatementDetailContentProps) {
  const [groupBy, setGroupBy] = useState<'product' | 'merchant'>('product');
  const cfg = STATUS_CONFIG[statement.status];

  // Synthesize per-merchant breakdown
  const merchantBreakdown = useMemo(() => {
    const seed = statement.id.length + statement.marketplace.id.length;
    const merchants = [
      { name: 'Helio Industries', short: 'HI' },
      { name: 'Ridgeline Co.', short: 'RC' },
      { name: 'Quanta Logistics', short: 'QL' },
      { name: 'Brightford Group', short: 'BG' },
      { name: 'Northstar Health', short: 'NH' },
      { name: 'Vela Foods', short: 'VF' },
    ];
    const count = 4 + (seed % 3);
    const buckets = merchants.slice(0, count).map((m, i) => ({
      ...m,
      weight: 1 + ((seed * (i + 3)) % 7),
    }));
    const totalWeight = buckets.reduce((s, b) => s + b.weight, 0);
    return buckets.map(b => {
      const share = b.weight / totalWeight;
      const seats = Math.round(statement.lineItems.reduce((s, li) => s + li.seats, 0) * share);
      const gross = Math.round(statement.gross * share * 100) / 100;
      const net = Math.round(gross * VENDOR.rev_share * 100) / 100;
      const products = statement.lineItems.slice(0, 2 + (seed + b.weight) % 2).map(li => li.name);
      return { ...b, seats, gross, net, products };
    });
  }, [statement.id, statement.marketplace.id, statement.gross, statement.lineItems]);

  const groupTabStyle = (active: boolean) => ({
    padding: '5px 10px',
    background: active ? '#fff' : 'transparent',
    border: 'none',
    borderRadius: 3,
    cursor: 'pointer',
    fontSize: 13,
    color: active ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-7)',
    fontWeight: active ? 600 : 500,
    fontFamily: 'inherit',
    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
    display: 'inline-flex' as const,
    alignItems: 'center' as const,
  });

  return (
    <Stack gap="sm">
      {/* Summary grid */}
      <Box bd="1px solid var(--mantine-color-gray-3)" style={{ borderRadius: 4, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <SummaryCell
          label="Period"
          value={`${fmtDateShort(statement.period.start)} – ${fmtDateShort(statement.period.end)}`}
          sub={fmtDate(statement.period.start, { year: 'numeric' })}
        />
        <SummaryCell
          label="Gross revenue"
          value={fmtUSD(statement.gross, 2)}
          sub={`${statement.lineItems.length} products`}
        />
        <SummaryCell
          label="AppDirect fee"
          value={fmtUSD(statement.fee, 2)}
          sub={`${Math.round((1 - VENDOR.rev_share) * 100)}% rev share`}
        />
        <SummaryCell
          label="Net payout"
          value={fmtUSD(statement.net, 2)}
          sub="Your share"
          highlight
          last
        />
      </Box>

      {/* Invoice metadata */}
      {(statement.invoice || statement.submittedDate || statement.paidDate) && (
        <Box
          bd="1px solid var(--mantine-color-gray-3)"
          p="sm"
          style={{ borderRadius: 4, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
        >
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>Invoice number</Text>
            <Text size="sm" ff={statement.invoice ? 'monospace' : undefined}>{statement.invoice ?? '—'}</Text>
          </Box>
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>Submitted</Text>
            <Text size="sm">{fmtDate(statement.submittedDate)}</Text>
          </Box>
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>Due date</Text>
            <Text size="sm">{fmtDate(statement.dueDate)}</Text>
          </Box>
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>Paid</Text>
            <Text size="sm" fw={statement.paidDate ? 600 : undefined} style={statement.paidDate ? { color: '#37b24d' } : undefined}>
              {fmtDate(statement.paidDate)}
            </Text>
          </Box>
        </Box>
      )}

      {/* Subscriptions breakdown */}
      <Box bd="1px solid var(--mantine-color-gray-3)" style={{ borderRadius: 4 }}>
        <Inline
          justify="space-between"
          align="center"
          px="sm"
          py="xs"
          style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Inline gap="sm" align="center">
            <Title order={5}>Subscriptions</Title>
            <Box
              style={{
                display: 'inline-flex',
                background: 'var(--mantine-color-gray-1)',
                borderRadius: 4,
                padding: 2,
              }}
            >
              <button onClick={() => setGroupBy('product')} style={groupTabStyle(groupBy === 'product')}>
                <i className="ri-apps-2-line" style={{ fontSize: 13, marginRight: 5 }} />
                By product
              </button>
              <button onClick={() => setGroupBy('merchant')} style={groupTabStyle(groupBy === 'merchant')}>
                <i className="ri-store-2-line" style={{ fontSize: 13, marginRight: 5 }} />
                By merchant
              </button>
            </Box>
          </Inline>
          <Button variant="default" size="xs" leftSection={<i className="ri-download-2-line" />}>
            Export CSV
          </Button>
        </Inline>

        {groupBy === 'product' ? (
          <ProductBreakdownTable statement={statement} />
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr bg="gray.0">
                <Table.Th><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Merchant</Text></Table.Th>
                <Table.Th><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Top products</Text></Table.Th>
                <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Active subs</Text></Table.Th>
                <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Gross</Text></Table.Th>
                <Table.Th style={{ textAlign: 'right' }}><Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Net</Text></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {merchantBreakdown.map((m, i) => (
                <Table.Tr key={i}>
                  <Table.Td>
                    <Inline gap="xs" align="center">
                      <Box
                        style={{
                          width: 26, height: 26, borderRadius: 4,
                          background: 'var(--mantine-color-gray-1)',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, fontWeight: 700, color: 'var(--mantine-color-gray-7)',
                          flexShrink: 0,
                        }}
                      >
                        {m.short}
                      </Box>
                      <Text fw={600} size="sm">{m.name}</Text>
                    </Inline>
                  </Table.Td>
                  <Table.Td><Text size="sm" c="dimmed">{m.products.join(', ')}</Text></Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm">{m.seats.toLocaleString()}</Text></Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" size="sm">{fmtUSD(m.gross)}</Text></Table.Td>
                  <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={600} size="sm">{fmtUSD(m.net)}</Text></Table.Td>
                </Table.Tr>
              ))}
              <Table.Tr bg="gray.0">
                <Table.Td fw={700} colSpan={2}>Total · {merchantBreakdown.length} merchants</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm">{merchantBreakdown.reduce((s, m) => s + m.seats, 0).toLocaleString()}</Text></Table.Td>
                <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm">{fmtUSD(statement.gross)}</Text></Table.Td>
                <Table.Td style={{ textAlign: 'right' }}><Text ff="monospace" fw={700} size="sm">{fmtUSD(statement.net)}</Text></Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        )}
      </Box>

      {/* Activity timeline */}
      <Box bd="1px solid var(--mantine-color-gray-3)" p="md" style={{ borderRadius: 4 }}>
        <Title order={5} mb="sm">Activity</Title>
        <StatementTimeline statement={statement} />
      </Box>

      {/* Drawer footer action */}
      {statement.status === 'ready' && (
        <Button
          variant="primary"
          leftSection={<i className="ri-file-text-line" />}
          onClick={() => onCreateInvoice(statement)}
        >
          Create invoice
        </Button>
      )}
      {statement.status === 'disputed' && (
        <Button variant="primary" leftSection={<i className="ri-message-3-line" />}>
          Contact support
        </Button>
      )}
    </Stack>
  );
}

// ============================= CREATE INVOICE MODAL =============================

interface CreateInvoiceModalProps {
  statement: Statement | null;
  onClose: () => void;
  onSubmit: (stmt: Statement, payload: { invoice: string; submittedDate: Date; dueDate: Date }) => void;
}

function CreateInvoiceModal({ statement, onClose, onSubmit }: CreateInvoiceModalProps) {
  const [step, setStep] = useState<'preview' | 'submitted'>('preview');
  const [poNumber, setPoNumber] = useState('');

  const newInvoiceNum = useMemo(() => `INV-${2400 + Math.floor(Math.random() * 99)}`, []);
  const due = addDays(TODAY, 30);

  function handleClose() {
    setStep('preview');
    setPoNumber('');
    onClose();
  }

  function handleSubmit() {
    if (!statement) return;
    onSubmit(statement, { invoice: newInvoiceNum, submittedDate: TODAY, dueDate: due });
    setStep('submitted');
  }

  if (!statement) return null;

  return (
    <Modal
      opened={!!statement}
      onClose={handleClose}
      title={step === 'preview' ? 'Create invoice' : undefined}
      size="lg"
      withCloseButton={step === 'preview'}
    >
      {step === 'preview' && (
        <Stack gap="md">
          <Text size="sm" c="dimmed" mt={-8}>Review and submit to AppDirect Finance</Text>

          {/* Invoice preview */}
          <Box bd="1px solid var(--mantine-color-gray-3)" p="lg" bg="gray.0" style={{ borderRadius: 4 }}>
            <Inline justify="space-between" align="flex-start" mb="lg">
              <Box>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed" style={{ letterSpacing: '0.08em' }}>Invoice</Text>
                <Text ff="monospace" fw={700} style={{ fontSize: 22 }}>{newInvoiceNum}</Text>
              </Box>
              <Box style={{ textAlign: 'right' }}>
                <Text size="xs" c="dimmed">Issue date</Text>
                <Text fw={600} size="sm">{fmtDate(TODAY)}</Text>
                <Text size="xs" c="dimmed" mt={6}>Due (Net 30)</Text>
                <Text fw={600} size="sm">{fmtDate(due)}</Text>
              </Box>
            </Inline>

            <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <Box>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>From</Text>
                <Text fw={600} size="sm">{VENDOR.name}</Text>
                <Text size="xs" c="dimmed">123 Market St, Suite 400<br />San Francisco, CA 94103</Text>
              </Box>
              <Box>
                <Text size="xs" tt="uppercase" fw={600} c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>Bill to</Text>
                <Text fw={600} size="sm">AppDirect, Inc.</Text>
                <Text size="xs" c="dimmed">ISV Network — Finance<br />Re: {statement.marketplace.name}</Text>
              </Box>
            </Box>

            <Box bg="white" bd="1px solid var(--mantine-color-gray-3)" style={{ borderRadius: 4 }}>
              <Table>
                <Table.Thead bg="gray.0">
                  <Table.Tr>
                    <Table.Th><Text size="xs" tt="uppercase" fw={600} c="dimmed">Description</Text></Table.Th>
                    <Table.Th style={{ textAlign: 'right' }}><Text size="xs" tt="uppercase" fw={600} c="dimmed">Amount</Text></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Td>
                      <Text fw={600} size="sm">SaaS revenue share — {fmtDate(statement.period.start, { month: 'long', year: 'numeric' })}</Text>
                      <Text size="xs" c="dimmed">{statement.marketplace.name} · Statement {statement.id}</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <Text ff="monospace" size="sm">{fmtUSD(statement.gross, 2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <Text size="sm" c="dimmed">Less: AppDirect platform fee ({Math.round((1 - VENDOR.rev_share) * 100)}%)</Text>
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <Text ff="monospace" size="sm" c="dimmed">−{fmtUSD(statement.fee, 2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr bg="blue.0">
                    <Table.Td><Text fw={700} size="sm">Total due</Text></Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      <Text ff="monospace" fw={700} style={{ fontSize: 16, color: '#326FDE' }}>{fmtUSD(statement.net, 2)}</Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
          </Box>

          <TextInput
            label="PO number (optional)"
            value={poNumber}
            onChange={(e) => setPoNumber(e.currentTarget.value)}
            placeholder="e.g. PO-2026-0042"
          />

          <Divider />

          <Inline justify="space-between" align="center">
            <Inline gap="xs" align="center">
              <i className="ri-shield-check-line" style={{ fontSize: 14, color: 'var(--mantine-color-gray-6)' }} />
              <Text size="xs" c="dimmed">Submitting confirms the amounts above are correct</Text>
            </Inline>
            <Inline gap="xs">
              <Button variant="default" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" leftSection={<i className="ri-send-plane-line" />} onClick={handleSubmit}>
                Submit invoice
              </Button>
            </Inline>
          </Inline>
        </Stack>
      )}

      {step === 'submitted' && (
        <Stack gap="md" align="center" py="xl">
          <Box
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(64,192,87,0.15)',
              color: '#2f9e44',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <i className="ri-check-line" style={{ fontSize: 30 }} />
          </Box>
          <Box style={{ textAlign: 'center' }}>
            <Title order={3}>Invoice submitted</Title>
            <Text size="sm" c="dimmed" mt="xs">
              <Text span ff="monospace">{newInvoiceNum}</Text> sent to AppDirect Finance.<br />
              You&apos;ll receive a confirmation email shortly.
            </Text>
          </Box>
          <Inline gap="xs" justify="center">
            <Button variant="default" onClick={handleClose}>Done</Button>
            <Button variant="primary" leftSection={<i className="ri-download-2-line" />}>Download PDF</Button>
          </Inline>
        </Stack>
      )}
    </Modal>
  );
}

// ============================= MAIN PAGE =============================

export default function PayoutsPage() {
  const initialRange = useMemo((): DateRange => {
    const q = Math.floor(TODAY.getMonth() / 3);
    return {
      start: new Date(TODAY.getFullYear(), (q - 1) * 3, 1),
      end: new Date(TODAY.getFullYear(), q * 3, 0),
      presetId: 'lastQ',
    };
  }, []);

  const [range, setRange] = useState<DateRange>(initialRange);
  const [presetId, setPresetId] = useState<string>('lastQ');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [marketFilter, setMarketFilter] = useState<string>('all');
  const [activeStmt, setActiveStmt] = useState<Statement | null>(null);
  const [invoiceStmt, setInvoiceStmt] = useState<Statement | null>(null);
  const [statements, setStatements] = useState<Statement[]>(STATEMENTS);
  const [toast, setToast] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortState>({ key: 'period', dir: 'desc' });

  function handlePresetChange(value: string | null) {
    if (!value) return;
    setPresetId(value);
    const r = getPresetRange(value);
    if (r) setRange({ ...r, presetId: value });
  }

  function handleDateRangeChange(val: [Date | null, Date | null]) {
    const [start, end] = val;
    if (start && end) {
      setRange({ start, end });
      setPresetId('custom');
    }
  }

  const inRange = useMemo(() => filterByRange(statements, range), [statements, range]);

  const kpis = useMemo(() => {
    const ready = inRange.filter(s => s.status === 'ready');
    const inFlight = inRange.filter(s => s.status === 'submitted');
    const paid = inRange.filter(s => s.status === 'paid');
    const disputed = inRange.filter(s => s.status === 'disputed');
    const allActive = inRange.filter(s => s.status !== 'accruing');
    return {
      readyAmount: ready.reduce((s, x) => s + x.net, 0),
      readyCount: ready.length,
      inFlightAmount: inFlight.reduce((s, x) => s + x.net, 0),
      inFlightCount: inFlight.length,
      paidAmount: paid.reduce((s, x) => s + x.net, 0),
      paidCount: paid.length,
      disputedAmount: disputed.reduce((s, x) => s + x.net, 0),
      disputedCount: disputed.length,
      allAmount: allActive.reduce((s, x) => s + x.net, 0),
      allCount: allActive.length,
    };
  }, [inRange]);

  const rows = useMemo(() => {
    let r = inRange.filter(s => s.status !== 'accruing');
    if (statusFilter !== 'all') r = r.filter(s => s.status === statusFilter);
    if (marketFilter !== 'all') r = r.filter(s => s.marketplace.id === marketFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(s =>
        s.id.toLowerCase().includes(q) ||
        (s.invoice && s.invoice.toLowerCase().includes(q)) ||
        s.marketplace.name.toLowerCase().includes(q) ||
        fmtDate(s.period.start, { month: 'long', year: 'numeric' }).toLowerCase().includes(q),
      );
    }
    const dir = sortBy.dir === 'asc' ? 1 : -1;
    return [...r].sort((a, b) => {
      switch (sortBy.key) {
        case 'period':    return (a.period.start.getTime() - b.period.start.getTime()) * dir;
        case 'net':       return (a.net - b.net) * dir;
        case 'submitted': return ((a.submittedDate?.getTime() ?? 0) - (b.submittedDate?.getTime() ?? 0)) * dir;
        case 'paid':      return ((a.paidDate?.getTime() ?? 0) - (b.paidDate?.getTime() ?? 0)) * dir;
        case 'status':    return a.status.localeCompare(b.status) * dir;
        default:          return 0;
      }
    });
  }, [inRange, statusFilter, marketFilter, search, sortBy]);

  function toggleSort(key: SortState['key']) {
    setSortBy(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  }

  function handleSubmitInvoice(stmt: Statement, payload: { invoice: string; submittedDate: Date; dueDate: Date }) {
    setStatements(prev =>
      prev.map(s => s.id === stmt.id
        ? { ...s, status: 'submitted', invoice: payload.invoice, submittedDate: payload.submittedDate, dueDate: payload.dueDate }
        : s,
      ),
    );
    setActiveStmt(null);
    setInvoiceStmt(null);
    setToast(`Invoice ${payload.invoice} submitted for ${stmt.id}`);
    setTimeout(() => setToast(null), 3500);
  }

  const drawerTitle = activeStmt ? (
    <Box>
      <Text size="xs" c="dimmed" ff="monospace">
        {activeStmt.id} · {activeStmt.marketplace.name}
      </Text>
      <Title order={4}>
        Statement · {fmtDate(activeStmt.period.start, { month: 'long', year: 'numeric' })}
      </Title>
      <Inline gap="xs" mt={4} align="center">
        <Badge color={STATUS_CONFIG[activeStmt.status].badge}>
          {STATUS_CONFIG[activeStmt.status].label}
        </Badge>
        <Text size="xs" c="dimmed">{STATUS_CONFIG[activeStmt.status].desc}</Text>
      </Inline>
    </Box>
  ) : null;

  return (
    <Stack gap="lg">
      {/* Page header */}
      <Inline align="flex-end" gap="md" style={{ flexWrap: 'wrap' }}>
        <Stack gap="xs" style={{ flex: '1 1 260px', minWidth: 260 }}>
          <Breadcrumb items={[{ label: 'Finance', href: '#' }, { label: 'Payouts' }]} />
          <Title order={2} style={{ letterSpacing: '-0.01em' }}>Payouts</Title>
          <Text size="sm" c="dimmed">Track revenue from AppDirect Network and submit invoices for disbursement.</Text>
        </Stack>
        <Inline gap="xs" align="center" style={{ flexShrink: 0 }}>
          <Select
            value={presetId}
            onChange={handlePresetChange}
            data={DATE_PRESETS}
            style={{ width: 160 }}
          />
          <DatePickerInput
            type="range"
            value={[range.start, range.end]}
            onChange={handleDateRangeChange}
            style={{ width: 220 }}
            valueFormat="MMM D, YYYY"
          />
          <Button variant="default" leftSection={<i className="ri-download-2-line" />}>Export</Button>
          <Button variant="default" leftSection={<i className="ri-bank-line" />}>Payment settings</Button>
        </Inline>
      </Inline>

      {/* KPI filter cards */}
      <SimpleGrid cols={4} spacing="sm">
        <FilterKPICard
          label="All statements"
          icon="ri-stack-line"
          tone="neutral"
          amount={kpis.allAmount}
          count={kpis.allCount}
          countLabel="statement"
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
        />
        <FilterKPICard
          label="Ready to invoice"
          icon="ri-time-line"
          tone="primary"
          amount={kpis.readyAmount}
          count={kpis.readyCount}
          countLabel="statement"
          active={statusFilter === 'ready'}
          onClick={() => setStatusFilter('ready')}
          highlight={kpis.readyCount > 0 && statusFilter !== 'ready'}
        />
        <FilterKPICard
          label="Pending payment"
          icon="ri-loader-4-line"
          tone="pending"
          amount={kpis.inFlightAmount}
          count={kpis.inFlightCount}
          countLabel="invoice"
          active={statusFilter === 'submitted'}
          onClick={() => setStatusFilter('submitted')}
        />
        <FilterKPICard
          label="Disbursed"
          icon="ri-check-double-line"
          tone="success"
          amount={kpis.paidAmount}
          count={kpis.paidCount}
          countLabel="payout"
          active={statusFilter === 'paid'}
          onClick={() => setStatusFilter('paid')}
        />
      </SimpleGrid>

      {/* Ready-to-invoice banner */}
      {kpis.readyCount > 0 && (
        <Box
          style={{
            background: 'linear-gradient(135deg, rgba(50,111,222,0.06), rgba(50,111,222,0.02))',
            border: '1px solid rgba(50,111,222,0.3)',
            borderRadius: 6,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Box
            style={{
              width: 38,
              height: 38,
              borderRadius: 4,
              background: '#326FDE',
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <i className="ri-file-text-line" style={{ fontSize: 18 }} />
          </Box>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} size="sm">
              {kpis.readyCount} statement{kpis.readyCount === 1 ? '' : 's'} ready to invoice — {fmtUSD(kpis.readyAmount)} available
            </Text>
            <Text size="xs" c="dimmed" mt={2}>Submit an invoice to start the payout process. Net 30 from submission.</Text>
          </Box>
          <Button variant="primary" onClick={() => setStatusFilter('ready')}>
            Review ready statements
          </Button>
        </Box>
      )}

      {/* Statements table card */}
      <Box bd="1px solid var(--mantine-color-gray-3)" bg="white" style={{ borderRadius: 4, boxShadow: 'var(--mantine-shadow-xs)' }}>
        {/* Toolbar */}
        <Inline
          gap="xs"
          p="xs"
          style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', flexWrap: 'wrap' }}
        >
          <Box style={{ flex: '1 1 240px', maxWidth: 360 }}>
            <TextInput
              placeholder="Search by statement ID, invoice, marketplace, period…"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<i className="ri-search-line" style={{ fontSize: 16 }} />}
            />
          </Box>
          {/* Disputed quick-filter */}
          <Box
            style={{
              display: 'inline-flex',
              background: 'var(--mantine-color-gray-1)',
              borderRadius: 4,
              padding: 2,
            }}
          >
            {(['all', 'disputed'] as const).map(val => {
              const active = statusFilter === val;
              return (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  style={{
                    padding: '5px 10px',
                    background: active ? '#fff' : 'transparent',
                    border: 'none',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontSize: 13,
                    color: active ? (val === 'disputed' ? '#e03131' : 'var(--mantine-color-gray-9)') : 'var(--mantine-color-gray-7)',
                    fontWeight: active ? 600 : 500,
                    fontFamily: 'inherit',
                    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  {val === 'all' ? 'All' : 'Disputed'}
                  {val === 'disputed' && kpis.disputedCount > 0 && (
                    <Text span size="xs" c={active ? 'red' : 'dimmed'} ff="monospace">{kpis.disputedCount}</Text>
                  )}
                </button>
              );
            })}
          </Box>
          <Box style={{ flex: 1 }} />
          <Select
            value={marketFilter}
            onChange={(v) => setMarketFilter(v ?? 'all')}
            data={[
              { value: 'all', label: 'All marketplaces' },
              ...MARKETPLACES.map(m => ({ value: m.id, label: m.name })),
            ]}
            style={{ width: 200 }}
          />
        </Inline>

        {/* Table */}
        <Table.ScrollContainer minWidth={700}>
          <Table highlightOnHover={false}>
            <Table.Thead>
              <Table.Tr bg="gray.0">
                <SortHeader label="Period" sortKey="period" sortBy={sortBy} onSort={toggleSort} />
                <Table.Th style={{ whiteSpace: 'nowrap' }}>
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Statement ID</Text>
                </Table.Th>
                <SortHeader label="Net payout" sortKey="net" sortBy={sortBy} onSort={toggleSort} align="right" />
                <SortHeader label="Status" sortKey="status" sortBy={sortBy} onSort={toggleSort} />
                <SortHeader label="Submitted" sortKey="submitted" sortBy={sortBy} onSort={toggleSort} />
                <SortHeader label="Paid" sortKey="paid" sortBy={sortBy} onSort={toggleSort} />
                <Table.Th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>Action</Text>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={7} style={{ padding: '60px 16px', textAlign: 'center' }}>
                    <Stack gap="xs" align="center">
                      <i className="ri-inbox-line" style={{ fontSize: 32, color: 'var(--mantine-color-gray-4)' }} />
                      <Text fw={600} c="dimmed">No statements match your filters</Text>
                      <Text size="sm" c="dimmed">Try a wider date range or clearing filters.</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              ) : (
                rows.map(s => (
                  <StatementRow
                    key={s.id}
                    stmt={s}
                    onOpen={() => setActiveStmt(s)}
                    onInvoice={() => setInvoiceStmt(s)}
                  />
                ))
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* Footer */}
        <Inline
          justify="space-between"
          align="center"
          px="md"
          py="xs"
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Text size="sm" c="dimmed">
            {rows.length} statement{rows.length === 1 ? '' : 's'}
          </Text>
          <Inline gap="xs" align="center">
            <Text size="sm" c="dimmed">Net total in view:</Text>
            <Text size="sm" ff="monospace" fw={600}>
              {fmtUSD(rows.reduce((s, x) => s + x.net, 0))}
            </Text>
          </Inline>
        </Inline>
      </Box>

      {/* Statement detail drawer */}
      <Drawer
        opened={!!activeStmt}
        onClose={() => setActiveStmt(null)}
        title={drawerTitle}
        size="xl"
        position="right"
      >
        {activeStmt && (
          <Stack gap="md">
            <Box py="xs">
              <Button
                variant="default"
                size="xs"
                leftSection={<i className="ri-download-2-line" />}
              >
                Download PDF
              </Button>
            </Box>
            <Divider />
            <StatementDetailContent
              statement={activeStmt}
              onCreateInvoice={(s) => { setActiveStmt(null); setInvoiceStmt(s); }}
            />
          </Stack>
        )}
      </Drawer>

      {/* Invoice creation modal */}
      <CreateInvoiceModal
        statement={invoiceStmt}
        onClose={() => setInvoiceStmt(null)}
        onSubmit={handleSubmitInvoice}
      />

      {/* Toast */}
      {toast && (
        <Box
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: '#011B58',
            color: '#fff',
            padding: '12px 18px',
            borderRadius: 4,
            fontSize: 14,
            boxShadow: 'var(--mantine-shadow-lg)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className="ri-checkbox-circle-fill" style={{ color: '#51cf66', fontSize: 18 }} />
          {toast}
        </Box>
      )}
    </Stack>
  );
}
