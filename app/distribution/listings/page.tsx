'use client';

import { useState, useMemo } from 'react';
import {
  Stack,
  Inline,
  Box,
  SimpleGrid,
  Text,
  Title,
  TextInput,
  Select,
  Badge,
  Button,
  Checkbox,
  Table,
  Avatar,
} from '@/components/DesignSystem';

// ============================= TYPES =============================

interface Listing {
  id: string;
  productId: string;
  productName: string;
  icon: string;
  iconColor: string;
  salesChannel: string;
  startingPrice: number;
  status: 'Active' | 'Inactive';
}

// ============================= MOCK DATA =============================

const LISTINGS: Listing[] = [
  { id: '1', productId: 'PRD-001', productName: 'Acme Cloud Storage', icon: 'ri-cloud-line', iconColor: 'blue', salesChannel: 'AppDirect', startingPrice: 9.99, status: 'Active' },
  { id: '2', productId: 'PRD-002', productName: 'Bitflow Data Stream', icon: 'ri-flow-chart', iconColor: 'violet', salesChannel: 'AWS Marketplace', startingPrice: 29.00, status: 'Active' },
  { id: '3', productId: 'PRD-003', productName: 'Cloudspark Secure Connect', icon: 'ri-shield-check-line', iconColor: 'teal', salesChannel: 'Azure Marketplace', startingPrice: 15.00, status: 'Active' },
  { id: '4', productId: 'PRD-004', productName: 'DataVault Backup Pro', icon: 'ri-database-2-line', iconColor: 'orange', salesChannel: 'Ingram Micro', startingPrice: 19.99, status: 'Inactive' },
  { id: '5', productId: 'PRD-005', productName: 'Acme Cloud Storage', icon: 'ri-cloud-line', iconColor: 'blue', salesChannel: 'Azure Marketplace', startingPrice: 10.99, status: 'Active' },
  { id: '6', productId: 'PRD-006', productName: 'EdgePoint Analytics', icon: 'ri-line-chart-line', iconColor: 'cyan', salesChannel: 'AppDirect', startingPrice: 49.00, status: 'Active' },
  { id: '7', productId: 'PRD-007', productName: 'FormStack Builder', icon: 'ri-layout-grid-line', iconColor: 'pink', salesChannel: 'AWS Marketplace', startingPrice: 12.00, status: 'Inactive' },
  { id: '8', productId: 'PRD-008', productName: 'GreenLog Compliance', icon: 'ri-file-shield-2-line', iconColor: 'green', salesChannel: 'Ingram Micro', startingPrice: 39.99, status: 'Active' },
  { id: '9', productId: 'PRD-009', productName: 'HiveSync Collaboration', icon: 'ri-team-line', iconColor: 'yellow', salesChannel: 'AppDirect', startingPrice: 8.00, status: 'Active' },
  { id: '10', productId: 'PRD-010', productName: 'Bitflow Data Stream', icon: 'ri-flow-chart', iconColor: 'violet', salesChannel: 'Azure Marketplace', startingPrice: 32.00, status: 'Inactive' },
  { id: '11', productId: 'PRD-011', productName: 'InvoiceNinja Billing', icon: 'ri-bill-line', iconColor: 'red', salesChannel: 'AWS Marketplace', startingPrice: 14.99, status: 'Active' },
  { id: '12', productId: 'PRD-012', productName: 'Cloudspark Secure Connect', icon: 'ri-shield-check-line', iconColor: 'teal', salesChannel: 'Ingram Micro', startingPrice: 18.00, status: 'Active' },
  { id: '13', productId: 'PRD-013', productName: 'NetPulse Monitor', icon: 'ri-pulse-line', iconColor: 'indigo', salesChannel: 'AppDirect', startingPrice: 24.99, status: 'Inactive' },
  { id: '14', productId: 'PRD-014', productName: 'DataVault Backup Pro', icon: 'ri-database-2-line', iconColor: 'orange', salesChannel: 'AWS Marketplace', startingPrice: 22.00, status: 'Active' },
  { id: '15', productId: 'PRD-015', productName: 'Skybridge API Gateway', icon: 'ri-git-branch-line', iconColor: 'grape', salesChannel: 'Azure Marketplace', startingPrice: 59.00, status: 'Active' },
  { id: '16', productId: 'PRD-016', productName: 'EdgePoint Analytics', icon: 'ri-line-chart-line', iconColor: 'cyan', salesChannel: 'Ingram Micro', startingPrice: 45.00, status: 'Active' },
  { id: '17', productId: 'PRD-017', productName: 'HiveSync Collaboration', icon: 'ri-team-line', iconColor: 'yellow', salesChannel: 'Azure Marketplace', startingPrice: 9.00, status: 'Inactive' },
  { id: '18', productId: 'PRD-018', productName: 'Acme Cloud Storage', icon: 'ri-cloud-line', iconColor: 'blue', salesChannel: 'Google Cloud Marketplace', startingPrice: 11.99, status: 'Active' },
  { id: '19', productId: 'PRD-019', productName: 'Skybridge API Gateway', icon: 'ri-git-branch-line', iconColor: 'grape', salesChannel: 'Salesforce AppExchange', startingPrice: 55.00, status: 'Active' },
  { id: '20', productId: 'PRD-020', productName: 'GreenLog Compliance', icon: 'ri-file-shield-2-line', iconColor: 'green', salesChannel: 'HubSpot Marketplace', startingPrice: 34.99, status: 'Active' },
  { id: '21', productId: 'PRD-021', productName: 'NetPulse Monitor', icon: 'ri-pulse-line', iconColor: 'indigo', salesChannel: 'Pax8', startingPrice: 27.00, status: 'Active' },
  { id: '22', productId: 'PRD-022', productName: 'FormStack Builder', icon: 'ri-layout-grid-line', iconColor: 'pink', salesChannel: 'Google Cloud Marketplace', startingPrice: 14.00, status: 'Inactive' },
  { id: '23', productId: 'PRD-023', productName: 'Bitflow Data Stream', icon: 'ri-flow-chart', iconColor: 'violet', salesChannel: 'Salesforce AppExchange', startingPrice: 35.00, status: 'Active' },
  { id: '24', productId: 'PRD-024', productName: 'DataVault Backup Pro', icon: 'ri-database-2-line', iconColor: 'orange', salesChannel: 'Pax8', startingPrice: 21.00, status: 'Inactive' },
  { id: '25', productId: 'PRD-025', productName: 'InvoiceNinja Billing', icon: 'ri-bill-line', iconColor: 'red', salesChannel: 'HubSpot Marketplace', startingPrice: 16.99, status: 'Active' },
];

const CHANNELS = ['AppDirect', 'AWS Marketplace', 'Azure Marketplace', 'Ingram Micro', 'Google Cloud Marketplace', 'Salesforce AppExchange', 'HubSpot Marketplace', 'Pax8'];

type SortField = 'productId' | 'productName' | 'salesChannel' | 'startingPrice' | 'status';
type SortDir = 'asc' | 'desc';

// ============================= STAT CARD =============================

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <Box
      bg="white"
      bd="1px solid var(--mantine-color-gray-3)"
      p="md"
      style={{ borderRadius: 4, boxShadow: 'var(--mantine-shadow-xs)' }}
    >
      <Inline justify="space-between" align="flex-start">
        <Stack gap={4}>
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
            {label}
          </Text>
          <Text size="xl" fw={700}>{value}</Text>
        </Stack>
        <Box
          bg="var(--mantine-color-blue-0)"
          style={{ borderRadius: 4, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <i className={icon} style={{ fontSize: 18, color: 'var(--mantine-color-blue-6)' }} />
        </Box>
      </Inline>
    </Box>
  );
}

// ============================= SORTABLE HEADER =============================

function SortableHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField | null;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <Table.Th
      style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
      onClick={() => onSort(field)}
    >
      <Inline gap={4} align="center">
        <Text size="xs" fw={600} c={active ? 'blue.6' : 'dimmed'}>
          {label}
        </Text>
        <i
          className={active ? (sortDir === 'asc' ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line') : 'ri-arrow-up-down-line'}
          style={{ fontSize: 14, color: active ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-4)' }}
        />
      </Inline>
    </Table.Th>
  );
}

// ============================= MAIN PAGE =============================

function ListingsPage() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string | null>('All Sales Channels');
  const [statusFilter, setStatusFilter] = useState<string | null>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const filtered = useMemo(() => {
    let result = LISTINGS;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.productName.toLowerCase().includes(q) ||
          l.productId.toLowerCase().includes(q) ||
          l.salesChannel.toLowerCase().includes(q),
      );
    }

    if (channelFilter && channelFilter !== 'All Sales Channels') {
      result = result.filter((l) => l.salesChannel === channelFilter);
    }

    if (statusFilter && statusFilter !== 'All') {
      result = result.filter((l) => l.status === statusFilter);
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const cmp = typeof aVal === 'number' ? aVal - (bVal as number) : String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [search, channelFilter, statusFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    const active = LISTINGS.filter((l) => l.status === 'Active').length;
    const channels = new Set(LISTINGS.map((l) => l.salesChannel)).size;
    return {
      total: LISTINGS.length,
      active,
      inactive: LISTINGS.length - active,
      channels,
    };
  }, []);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  }

  const allChecked = filtered.length > 0 && selected.size === filtered.length;
  const someChecked = selected.size > 0 && selected.size < filtered.length;

  return (
    <Stack gap="lg">
      {/* Page header */}
      <Stack gap="xs">
        <Title order={2} style={{ letterSpacing: '-0.01em' }}>Listings</Title>
        <Text size="sm" c="dimmed">
          All products distributed across your connected sales channels.
        </Text>
      </Stack>

      {/* Stats bar */}
      <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
        <StatCard label="Total Listings" value={stats.total} icon="ri-list-check-2" />
        <StatCard label="Active" value={stats.active} icon="ri-checkbox-circle-line" />
        <StatCard label="Inactive" value={stats.inactive} icon="ri-close-circle-line" />
        <StatCard label="Connected Channels" value={stats.channels} icon="ri-links-line" />
      </SimpleGrid>

      {/* Filters */}
      <Box
        bd="1px solid var(--mantine-color-gray-3)"
        bg="white"
        p="md"
        style={{ borderRadius: 4, boxShadow: 'var(--mantine-shadow-xs)' }}
      >
        <Stack gap="sm">
          <Box style={{ width: '50%' }}>
            <TextInput
              placeholder="Search by product name, ID, or channel..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              leftSection={<i className="ri-search-line" style={{ fontSize: 16 }} />}
            />
          </Box>
          <Inline gap="sm" align="flex-end">
            <Box style={{ width: 220 }}>
              <Select
                label="Sales Channel"
                data={['All Sales Channels', ...CHANNELS]}
                value={channelFilter}
                onChange={setChannelFilter}
              />
            </Box>
            <Box style={{ width: 160 }}>
              <Select
                label="Status"
                data={['All', 'Active', 'Inactive']}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </Box>
          </Inline>
        </Stack>
      </Box>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <Box
          bg="var(--mantine-color-blue-0)"
          bd="1px solid var(--mantine-color-blue-2)"
          p="sm"
          style={{ borderRadius: 4 }}
        >
          <Inline justify="space-between" align="center">
            <Text size="sm" fw={600} c="blue.7">
              {selected.size} listing{selected.size === 1 ? '' : 's'} selected
            </Text>
            <Inline gap="xs">
              <Button
                variant="default"
                size="xs"
                leftSection={<i className="ri-forbid-line" style={{ fontSize: 14 }} />}
              >
                Deactivate
              </Button>
              <Button
                variant="default"
                size="xs"
                leftSection={<i className="ri-download-2-line" style={{ fontSize: 14 }} />}
              >
                Export
              </Button>
            </Inline>
          </Inline>
        </Box>
      )}

      {/* Data table */}
      <Box
        bg="white"
        bd="1px solid var(--mantine-color-gray-3)"
        style={{ borderRadius: 4, boxShadow: 'var(--mantine-shadow-xs)', overflow: 'hidden' }}
      >
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: 40 }}>
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </Table.Th>
                <Table.Th style={{ width: 48 }} />
                <SortableHeader label="Product ID" field="productId" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Product Name" field="productName" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Sales Channel" field="salesChannel" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Starting Price" field="startingPrice" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtered.map((listing) => (
                <Table.Tr
                  key={listing.id}
                  bg={selected.has(listing.id) ? 'var(--mantine-color-blue-0)' : undefined}
                >
                  <Table.Td>
                    <Checkbox
                      checked={selected.has(listing.id)}
                      onChange={() => toggleRow(listing.id)}
                      aria-label={`Select ${listing.productName}`}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Avatar size="sm" radius="sm" color={listing.iconColor}>
                      <i className={listing.icon} style={{ fontSize: 14 }} />
                    </Avatar>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace" c="dimmed">{listing.productId}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{listing.productName}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{listing.salesChannel}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">${listing.startingPrice.toFixed(2)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={listing.status === 'Active' ? 'green' : 'gray'}
                      size="sm"
                    >
                      {listing.status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
              {filtered.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <Stack gap="xs" align="center" py="xl">
                      <i className="ri-file-search-line" style={{ fontSize: 32, color: 'var(--mantine-color-gray-4)' }} />
                      <Text fw={600} c="dimmed">No listings match your filters</Text>
                      <Text size="sm" c="dimmed">Try adjusting your search or clearing filters.</Text>
                    </Stack>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>

      {/* Results footer */}
      <Inline justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Showing <Text span fw={600} c="dark">{filtered.length}</Text> of {LISTINGS.length} listings
        </Text>
      </Inline>
    </Stack>
  );
}

// ============================= ROUTE EXPORT =============================

export default function ListingsRoute() {
  return <ListingsPage />;
}
