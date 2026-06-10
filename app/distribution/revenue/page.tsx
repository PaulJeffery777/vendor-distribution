'use client';

import {
  Button,
  TextInput,
  Chip,
  Combobox,
  Checkbox,
  ThemeIcon,
  Indicator,
  Select,
  Stack,
  Inline,
  Box,
  SimpleGrid,
  Flex,
  Text,
  Title,
  Table,
} from '@/components/DesignSystem';
import { RiCircleLine, RiStarLine } from '@remixicon/react';

// ============================= MOCK DATA =============================

interface ProductRow {
  name: string;
  productId: string;
  stagingId: string;
  activeOrders: number;
  activeARR: string;
  lifetimeRevenue: string;
  totalOrderValue: string;
}

const PRODUCTS: ProductRow[] = [
  { name: 'Acme Pro', productId: '896331', stagingId: '298564', activeOrders: 3, activeARR: '$00.00', lifetimeRevenue: '$7,248.00', totalOrderValue: '$48.00' },
  { name: 'TaskMaster Pro', productId: '234567', stagingId: '234567', activeOrders: 5, activeARR: '$6,649.99', lifetimeRevenue: '$85,005.00', totalOrderValue: '$859.99' },
  { name: 'CloudSync Plus', productId: '345678', stagingId: '345678', activeOrders: 12, activeARR: '$29.99', lifetimeRevenue: '$56,783.00', totalOrderValue: '$2,139.99' },
  { name: 'PixelFrame Studio', productId: '456789', stagingId: '456789', activeOrders: 7, activeARR: '$89.00', lifetimeRevenue: '$44,782.00', totalOrderValue: '$199.00' },
  { name: 'SecureVault', productId: '567890', stagingId: '567890', activeOrders: 3, activeARR: '$59.99', lifetimeRevenue: '$8,954.00', totalOrderValue: '$279.99' },
];

// ============================= STAT CARD =============================

function StatCard({
  amount,
  label,
  indicator,
  action,
}: {
  amount: string;
  label: string;
  indicator?: { color: string; text: string };
  action: React.ReactNode;
}) {
  return (
    <Box
      style={{
        background: '#fff',
        border: '1px solid #dee2e6',
        borderRadius: 10,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: '16px 20px 10px',
        height: 160,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Title order={1} fw={700} style={{ fontSize: 34, lineHeight: 1.2 }}>
        {amount}
      </Title>
      <Text size="sm" c="dimmed" mt={4}>{label}</Text>
      <Flex mt="auto" align="center" justify="space-between">
        {indicator ? (
          <Inline gap="xs" align="center">
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: indicator.color,
                flexShrink: 0,
              }}
            />
            <Text size="xs" c="dimmed">{indicator.text}</Text>
          </Inline>
        ) : (
          <span />
        )}
        {action}
      </Flex>
    </Box>
  );
}

// ============================= PAGE =============================

export default function RevenuePage() {
  return (
    <Stack gap="lg">
      {/* ---- Stat Cards ---- */}
      <SimpleGrid cols={3} spacing="md">
        <StatCard
          amount="$89,728"
          label="Total revenue this period"
          action={
            <Button variant="link" size="xs" rightSection={<RiCircleLine size={14} />}>
              View All
            </Button>
          }
        />
        <StatCard
          amount="$43,803"
          label="Revenue this period"
          indicator={{ color: '#2f9e44', text: 'Invoiced' }}
          action={
            <Button variant="link" size="xs" rightSection={<RiCircleLine size={14} />}>
              View All
            </Button>
          }
        />
        <StatCard
          amount="$45,926"
          label="Revenue this period"
          indicator={{ color: '#adb5bd', text: 'Not Invoiced' }}
          action={
            <Button variant="link" size="xs">Create Invoice</Button>
          }
        />
      </SimpleGrid>

      {/* ---- Table Section ---- */}
      <Stack gap={0}>
        {/* Section header */}
        <Inline align="center" justify="space-between" mb="md">
          <Title order={2} fw={700} style={{ fontSize: 22 }}>
            Product Revenue Metrics
          </Title>
          <Button variant="outline" size="xs" rightSection={<RiCircleLine size={14} />}>
            Download CSV
          </Button>
        </Inline>

        {/* Control panel */}
        <Box
          style={{
            background: '#fff',
            borderBottom: '1px solid #dee2e6',
            padding: '16px 16px 0',
          }}
        >
          {/* Row 1: filter + search + density */}
          <Inline align="center" gap="sm" mb="sm">
            <Button variant="outline" size="xs" px={8}>
              <i className="ri-filter-3-line" style={{ fontSize: 14 }} />
            </Button>
            <TextInput
              size="xs"
              placeholder="Search by product name or ID"
              leftSection={<i className="ri-search-line" style={{ fontSize: 14 }} />}
              style={{ flex: 1 }}
            />
            <Inline gap={0} ml="auto">
              <Button variant="outline" size="xs" px={8} style={{ borderRadius: '4px 0 0 4px' }}>
                <i className="ri-list-unordered" style={{ fontSize: 14 }} />
              </Button>
              <Button variant="outline" size="xs" px={8} style={{ borderRadius: 0, borderLeft: 'none' }}>
                <i className="ri-grid-line" style={{ fontSize: 14 }} />
              </Button>
              <Button variant="outline" size="xs" px={8} style={{ borderRadius: '0 4px 4px 0', borderLeft: 'none' }}>
                <i className="ri-layout-row-line" style={{ fontSize: 14 }} />
              </Button>
            </Inline>
          </Inline>

          {/* Row 2: clear filters + chips + results count */}
          <Inline align="center" gap="sm" mb="sm">
            <Button variant="link" size="xs">Clear filters</Button>
            <Chip size="xs">Chip</Chip>
            <Chip size="xs">Chip</Chip>
            <Chip size="xs">Chip</Chip>
            <Chip size="xs">Chip</Chip>
            <Text size="xs" c="dimmed" ml="auto">24 results</Text>
          </Inline>

          {/* Row 3: combobox filters */}
          <Inline align="flex-end" gap="sm" pb="md">
            <Combobox
              label="Date"
              placeholder="Show All"
              size="xs"
              data={['Show All', 'Last 7 days', 'Last 30 days', 'Last 90 days']}
              style={{ width: 180 }}
            />
            <Combobox
              label="Type"
              placeholder="Show All"
              size="xs"
              data={['Show All', 'Subscription', 'One-time', 'Usage']}
              style={{ width: 180 }}
            />
            <Combobox
              label="Display Details"
              placeholder="Show All"
              size="xs"
              data={['Show All', 'Compact', 'Expanded']}
              style={{ width: 180 }}
            />
          </Inline>
        </Box>

        {/* Table */}
        <Table>
          <Table.Thead>
            <Table.Tr style={{ background: 'var(--mantine-color-gray-0)' }}>
              <Table.Th style={{ width: 54 }}>
                <Checkbox size="xs" />
              </Table.Th>
              <Table.Th style={{ width: 398 }}>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Product Name
                </Text>
              </Table.Th>
              <Table.Th style={{ width: 128, textAlign: 'right' }}>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Active Orders
                </Text>
              </Table.Th>
              <Table.Th style={{ width: 148, textAlign: 'right' }}>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Active ARR
                </Text>
              </Table.Th>
              <Table.Th style={{ width: 148, textAlign: 'right' }}>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Lifetime Revenue
                </Text>
              </Table.Th>
              <Table.Th style={{ width: 152, textAlign: 'right' }}>
                <Text size="xs" fw={600} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.06em' }}>
                  Total Order Value
                </Text>
              </Table.Th>
              <Table.Th style={{ width: 42, textAlign: 'center' }} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {PRODUCTS.map((p) => (
              <Table.Tr key={p.productId} style={{ background: '#fff' }}>
                <Table.Td style={{ width: 54 }}>
                  <Checkbox size="xs" />
                </Table.Td>
                <Table.Td>
                  <Inline gap="sm" align="center">
                    <ThemeIcon size="xl" variant="default">
                      <RiStarLine size={16} />
                    </ThemeIcon>
                    <Stack gap={0}>
                      <Text fw={700} style={{ fontSize: 16 }}>{p.name}</Text>
                      <Text size="xs" c="dimmed" style={{ fontSize: 12, color: '#495057' }}>
                        {p.productId} / {p.stagingId}
                      </Text>
                    </Stack>
                  </Inline>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={700} style={{ fontSize: 14 }}>{p.activeOrders}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={700} style={{ fontSize: 14 }}>{p.activeARR}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={700} style={{ fontSize: 14 }}>{p.lifetimeRevenue}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                  <Text fw={700} style={{ fontSize: 14 }}>{p.totalOrderValue}</Text>
                </Table.Td>
                <Table.Td style={{ textAlign: 'center' }}>
                  <Button variant="secret" size="xs" px={4}>
                    <i className="ri-more-2-fill" style={{ fontSize: 16 }} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {/* Footer */}
        <Inline
          align="center"
          justify="space-between"
          px="md"
          py="sm"
          style={{
            background: '#f1f3f5',
            borderTop: '1px solid #dee2e6',
          }}
        >
          <Inline gap="sm" align="center">
            <Text size="sm" c="dimmed">Rows per page</Text>
            <Select
              size="xs"
              data={['10', '20', '50', '100']}
              defaultValue="20"
              style={{ width: 59 }}
            />
          </Inline>
          <Inline gap="sm" align="center">
            <Text size="sm" c="dimmed">1–20 of 1,256</Text>
            <Button variant="outline" size="xs" px={8}>
              <i className="ri-arrow-left-s-line" style={{ fontSize: 14 }} />
            </Button>
            <Button variant="outline" size="xs" px={8}>
              <i className="ri-arrow-right-s-line" style={{ fontSize: 14 }} />
            </Button>
          </Inline>
        </Inline>
      </Stack>
    </Stack>
  );
}
