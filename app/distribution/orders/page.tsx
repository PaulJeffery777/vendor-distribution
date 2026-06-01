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
  Menu,
} from '@/components/DesignSystem';

// ============================= TYPES =============================

type FulfilmentStatus = 'Fulfilled' | 'Unfulfilled' | 'Cancelled';

interface Order {
  id: string;
  orderId: string;
  date: string;
  customer: string;
  salesChannel: string;
  amount: number;
  status: FulfilmentStatus;
  items: number;
}

// ============================= MOCK DATA =============================

const ORDERS: Order[] = [
  { id: '1', orderId: 'ORD-10001', date: '2026-05-28', customer: 'Meridian Health Systems', salesChannel: 'AppDirect', amount: 2499.00, status: 'Fulfilled', items: 3 },
  { id: '2', orderId: 'ORD-10002', date: '2026-05-27', customer: 'Northstar Logistics Inc', salesChannel: 'AWS Marketplace', amount: 8750.00, status: 'Unfulfilled', items: 1 },
  { id: '3', orderId: 'ORD-10003', date: '2026-05-27', customer: 'Cascade Financial Group', salesChannel: 'Azure Marketplace', amount: 1200.00, status: 'Fulfilled', items: 2 },
  { id: '4', orderId: 'ORD-10004', date: '2026-05-26', customer: 'Brightpath Education', salesChannel: 'Ingram Micro', amount: 450.00, status: 'Cancelled', items: 1 },
  { id: '5', orderId: 'ORD-10005', date: '2026-05-26', customer: 'Velox Manufacturing Co', salesChannel: 'AppDirect', amount: 3200.00, status: 'Unfulfilled', items: 5 },
  { id: '6', orderId: 'ORD-10006', date: '2026-05-25', customer: 'Pinnacle Real Estate', salesChannel: 'AWS Marketplace', amount: 999.00, status: 'Fulfilled', items: 1 },
  { id: '7', orderId: 'ORD-10007', date: '2026-05-25', customer: 'Ironclad Security Ltd', salesChannel: 'Azure Marketplace', amount: 5400.00, status: 'Fulfilled', items: 4 },
  { id: '8', orderId: 'ORD-10008', date: '2026-05-24', customer: 'Summit Analytics Corp', salesChannel: 'Pax8', amount: 1875.00, status: 'Unfulfilled', items: 2 },
  { id: '9', orderId: 'ORD-10009', date: '2026-05-24', customer: 'Greenleaf Hospitality', salesChannel: 'AppDirect', amount: 680.00, status: 'Fulfilled', items: 1 },
  { id: '10', orderId: 'ORD-10010', date: '2026-05-23', customer: 'Apex Consulting Group', salesChannel: 'Ingram Micro', amount: 12500.00, status: 'Fulfilled', items: 8 },
  { id: '11', orderId: 'ORD-10011', date: '2026-05-23', customer: 'Redstone Energy Partners', salesChannel: 'Google Cloud Marketplace', amount: 3600.00, status: 'Unfulfilled', items: 3 },
  { id: '12', orderId: 'ORD-10012', date: '2026-05-22', customer: 'Bluewave Media Group', salesChannel: 'AWS Marketplace', amount: 750.00, status: 'Cancelled', items: 1 },
  { id: '13', orderId: 'ORD-10013', date: '2026-05-22', customer: 'Orion Tech Solutions', salesChannel: 'Salesforce AppExchange', amount: 4200.00, status: 'Fulfilled', items: 2 },
  { id: '14', orderId: 'ORD-10014', date: '2026-05-21', customer: 'Tidewater Shipping LLC', salesChannel: 'Azure Marketplace', amount: 1950.00, status: 'Unfulfilled', items: 3 },
  { id: '15', orderId: 'ORD-10015', date: '2026-05-21', customer: 'Prism Design Studio', salesChannel: 'HubSpot Marketplace', amount: 320.00, status: 'Fulfilled', items: 1 },
  { id: '16', orderId: 'ORD-10016', date: '2026-05-20', customer: 'Lakeshore Biotech', salesChannel: 'AppDirect', amount: 7800.00, status: 'Fulfilled', items: 6 },
  { id: '17', orderId: 'ORD-10017', date: '2026-05-20', customer: 'Steelbridge Construction', salesChannel: 'Ingram Micro', amount: 560.00, status: 'Cancelled', items: 1 },
  { id: '18', orderId: 'ORD-10018', date: '2026-05-19', customer: 'Quantum Data Systems', salesChannel: 'AWS Marketplace', amount: 2100.00, status: 'Unfulfilled', items: 2 },
  { id: '19', orderId: 'ORD-10019', date: '2026-05-19', customer: 'Horizon Aerospace Inc', salesChannel: 'Pax8', amount: 15000.00, status: 'Fulfilled', items: 10 },
  { id: '20', orderId: 'ORD-10020', date: '2026-05-18', customer: 'Cornerstone Legal Partners', salesChannel: 'Google Cloud Marketplace', amount: 890.00, status: 'Unfulfilled', items: 1 },
  { id: '21', orderId: 'ORD-10021', date: '2026-05-18', customer: 'Frostbyte Cybersecurity', salesChannel: 'Azure Marketplace', amount: 6300.00, status: 'Fulfilled', items: 4 },
  { id: '22', orderId: 'ORD-10022', date: '2026-05-17', customer: 'Evergreen Supply Chain', salesChannel: 'Salesforce AppExchange', amount: 1100.00, status: 'Fulfilled', items: 2 },
  { id: '23', orderId: 'ORD-10023', date: '2026-05-17', customer: 'Atlas Workforce Solutions', salesChannel: 'AppDirect', amount: 4750.00, status: 'Unfulfilled', items: 3 },
  { id: '24', orderId: 'ORD-10024', date: '2026-05-16', customer: 'Silverpeak Ventures', salesChannel: 'HubSpot Marketplace', amount: 280.00, status: 'Cancelled', items: 1 },
  { id: '25', orderId: 'ORD-10025', date: '2026-05-16', customer: 'Cobalt Pharmaceuticals', salesChannel: 'Ingram Micro', amount: 9200.00, status: 'Fulfilled', items: 7 },
];

const CHANNELS = ['AppDirect', 'AWS Marketplace', 'Azure Marketplace', 'Ingram Micro', 'Google Cloud Marketplace', 'Salesforce AppExchange', 'HubSpot Marketplace', 'Pax8'];

type SortField = 'orderId' | 'date' | 'customer' | 'salesChannel' | 'amount' | 'status' | 'items';
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

// ============================= HELPERS =============================

const STATUS_COLOR: Record<FulfilmentStatus, string> = {
  Fulfilled: 'green',
  Unfulfilled: 'orange',
  Cancelled: 'gray',
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================= MAIN PAGE =============================

function OrdersPage() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<string | null>('All Sales Channels');
  const [statusFilter, setStatusFilter] = useState<string | null>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const filtered = useMemo(() => {
    let result = ORDERS;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.salesChannel.toLowerCase().includes(q),
      );
    }

    if (channelFilter && channelFilter !== 'All Sales Channels') {
      result = result.filter((o) => o.salesChannel === channelFilter);
    }

    if (statusFilter && statusFilter !== 'All') {
      result = result.filter((o) => o.status === statusFilter);
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
    const unfulfilled = ORDERS.filter((o) => o.status === 'Unfulfilled').length;
    const fulfilled = ORDERS.filter((o) => o.status === 'Fulfilled').length;
    const revenue = ORDERS.reduce((sum, o) => sum + o.amount, 0);
    return {
      total: ORDERS.length,
      unfulfilled,
      fulfilled,
      revenue,
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
      setSelected(new Set(filtered.map((o) => o.id)));
    }
  }

  const allChecked = filtered.length > 0 && selected.size === filtered.length;
  const someChecked = selected.size > 0 && selected.size < filtered.length;

  return (
    <Stack gap="lg">
      {/* Page header */}
      <Stack gap="xs">
        <Title order={2} style={{ letterSpacing: '-0.01em' }}>Orders</Title>
        <Text size="sm" c="dimmed">
          Manage order fulfilment across all your sales channels.
        </Text>
      </Stack>

      {/* Stats bar */}
      <SimpleGrid cols={{ base: 2, sm: 5 }} spacing="md">
        <StatCard label="Total Orders" value={stats.total} icon="ri-file-list-3-line" />
        <StatCard label="Unfulfilled" value={stats.unfulfilled} icon="ri-time-line" />
        <StatCard label="Fulfilled" value={stats.fulfilled} icon="ri-checkbox-circle-line" />
        <StatCard label="Total Revenue" value={formatCurrency(stats.revenue)} icon="ri-money-dollar-circle-line" />
        <StatCard label="Avg. Order Value" value={formatCurrency(stats.revenue / stats.total)} icon="ri-bar-chart-2-line" />
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
              placeholder="Search by order ID, customer, or channel..."
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
            <Box style={{ width: 180 }}>
              <Select
                label="Fulfilment Status"
                data={['All', 'Unfulfilled', 'Fulfilled', 'Cancelled']}
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
              {selected.size} order{selected.size === 1 ? '' : 's'} selected
            </Text>
            <Inline gap="xs">
              <Button
                variant="default"
                size="xs"
                leftSection={<i className="ri-checkbox-circle-line" style={{ fontSize: 14 }} />}
              >
                Mark as Fulfilled
              </Button>
              <Button
                variant="default"
                size="xs"
                leftSection={<i className="ri-download-2-line" style={{ fontSize: 14 }} />}
              >
                Export
              </Button>
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="default"
                    size="xs"
                    rightSection={<i className="ri-arrow-down-s-line" style={{ fontSize: 14 }} />}
                  >
                    More actions
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<i className="ri-printer-line" style={{ fontSize: 14 }} />}>
                    Print packing slips
                  </Menu.Item>
                  <Menu.Item leftSection={<i className="ri-mail-send-line" style={{ fontSize: 14 }} />}>
                    Email customers
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item color="red" leftSection={<i className="ri-close-circle-line" style={{ fontSize: 14 }} />}>
                    Cancel orders
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
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
        <Table.ScrollContainer minWidth={900}>
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
                <SortableHeader label="Order ID" field="orderId" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Date" field="date" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Customer" field="customer" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Sales Channel" field="salesChannel" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Amount" field="amount" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortableHeader label="Items" field="items" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filtered.map((order) => (
                <Table.Tr
                  key={order.id}
                  bg={selected.has(order.id) ? 'var(--mantine-color-blue-0)' : undefined}
                >
                  <Table.Td>
                    <Checkbox
                      checked={selected.has(order.id)}
                      onChange={() => toggleRow(order.id)}
                      aria-label={`Select ${order.orderId}`}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace" fw={500} c="blue.6">{order.orderId}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{formatDate(order.date)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{order.customer}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.salesChannel}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ff="monospace">{formatCurrency(order.amount)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={STATUS_COLOR[order.status]} size="sm">
                      {order.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" ta="center">{order.items}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
              {filtered.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Stack gap="xs" align="center" py="xl">
                      <i className="ri-file-search-line" style={{ fontSize: 32, color: 'var(--mantine-color-gray-4)' }} />
                      <Text fw={600} c="dimmed">No orders match your filters</Text>
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
          Showing <Text span fw={600} c="dark">{filtered.length}</Text> of {ORDERS.length} orders
        </Text>
      </Inline>
    </Stack>
  );
}

// ============================= ROUTE EXPORT =============================

export default function OrdersRoute() {
  return <OrdersPage />;
}
