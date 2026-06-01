'use client';

import { useState, useMemo } from 'react';
import {
  SingleColumnLayout,
  Badge,
  Button,
  Drawer,
  Stack,
  Inline,
  Box,
  SimpleGrid,
  Text,
  Title,
  TextInput,
  Avatar,
  Divider,
  Select,
} from '@/components/DesignSystem';

// ============================= TYPES =============================

interface SalesChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  region: string;
  description: string;
  fullDescription: string;
  rating: number;
  vendorCount: number;
  connected: boolean;
  eligibility: string[];
  commissionRate: string;
}

// ============================= MOCK DATA =============================

const CHANNELS: SalesChannel[] = [
  {
    id: 'appdirect',
    name: 'AppDirect',
    logo: 'ri-apps-2-line',
    category: 'Productivity',
    region: 'Global',
    description: 'Leading cloud commerce platform connecting SaaS vendors with enterprise buyers worldwide.',
    fullDescription: 'AppDirect is the world\'s largest B2B SaaS marketplace and cloud commerce platform. It connects technology providers with enterprise customers through a curated ecosystem of business applications, enabling vendors to reach millions of buyers across telecommunications, financial services, and media verticals.',
    rating: 4.8,
    vendorCount: 3200,
    connected: true,
    eligibility: ['SOC 2 Type II certified', 'API integration required', 'Minimum 12-month track record'],
    commissionRate: '15-20%',
  },
  {
    id: 'ingram-micro',
    name: 'Ingram Micro Cloud',
    logo: 'ri-cloud-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Enterprise-grade cloud marketplace with deep channel partner network and provisioning tools.',
    fullDescription: 'Ingram Micro Cloud is one of the largest cloud distribution platforms, serving over 200,000 channel partners globally. The platform offers automated provisioning, billing integration, and a partner ecosystem that spans MSPs, VARs, and system integrators across 64 countries.',
    rating: 4.5,
    vendorCount: 2800,
    connected: true,
    eligibility: ['Cloud-native architecture', 'Multi-tenant support', 'Partner program enrollment'],
    commissionRate: '18-25%',
  },
  {
    id: 'td-synnex',
    name: 'TD SYNNEX StreamOne',
    logo: 'ri-exchange-line',
    category: 'Infrastructure',
    region: 'North America',
    description: 'Unified cloud platform providing end-to-end lifecycle management for technology solutions.',
    fullDescription: 'TD SYNNEX StreamOne is a cloud aggregation and orchestration platform that simplifies the procurement and management of cloud services. It serves as a single point of integration for resellers and MSPs to discover, provision, and manage multi-vendor cloud solutions with automated billing.',
    rating: 4.3,
    vendorCount: 1950,
    connected: false,
    eligibility: ['Vendor onboarding application', 'Technical integration assessment', 'Revenue share agreement'],
    commissionRate: '15-22%',
  },
  {
    id: 'pax8',
    name: 'Pax8',
    logo: 'ri-shield-star-line',
    category: 'Security',
    region: 'North America',
    description: 'Cloud commerce marketplace purpose-built for MSPs to buy, sell, and manage technology.',
    fullDescription: 'Pax8 simplifies the way organizations buy, sell, and manage cloud solutions by serving as a born-in-the-cloud distribution platform exclusively for the MSP channel. Its curated marketplace focuses on best-of-breed solutions with deep integrations and white-glove vendor support.',
    rating: 4.7,
    vendorCount: 1400,
    connected: false,
    eligibility: ['MSP-ready product', 'Multi-tenant management console', 'API-first design'],
    commissionRate: '12-18%',
  },
  {
    id: 'aws-marketplace',
    name: 'AWS Marketplace',
    logo: 'ri-amazon-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Digital catalog of thousands of software listings from independent vendors on Amazon Web Services.',
    fullDescription: 'AWS Marketplace is a curated digital catalog that makes it easy for customers to find, buy, deploy, and manage third-party software, data, and services. Vendors benefit from AWS\'s massive customer base, consolidated billing, and the ability to leverage customers\' existing AWS committed spend.',
    rating: 4.6,
    vendorCount: 4500,
    connected: true,
    eligibility: ['AWS Partner Network membership', 'FTR (Foundational Technical Review)', 'SaaS or AMI deployment model'],
    commissionRate: '15-20%',
  },
  {
    id: 'azure-marketplace',
    name: 'Azure Marketplace',
    logo: 'ri-microsoft-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Microsoft\'s commercial marketplace for purchasing and deploying cloud applications and services.',
    fullDescription: 'Azure Marketplace offers customers an extensive catalog of certified solutions optimized for Azure. Vendors gain access to Microsoft\'s enterprise customer base, co-sell opportunities with Microsoft sales teams, and the ability to transact against customers\' Microsoft Azure Consumption Commitment (MACC) budgets.',
    rating: 4.5,
    vendorCount: 3800,
    connected: false,
    eligibility: ['Microsoft Partner Network enrollment', 'Azure-compatible deployment', 'Commercial marketplace publisher account'],
    commissionRate: '3-20%',
  },
  {
    id: 'gcp-marketplace',
    name: 'Google Cloud Marketplace',
    logo: 'ri-google-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Enterprise marketplace for deploying production-grade solutions on Google Cloud Platform.',
    fullDescription: 'Google Cloud Marketplace lets users quickly deploy functional software packages that run on Google Cloud. The platform offers integrated billing, one-click deployment, and the ability for customers to use committed GCP spend on third-party solutions, driving faster sales cycles and enterprise adoption.',
    rating: 4.4,
    vendorCount: 2200,
    connected: false,
    eligibility: ['Google Cloud Partner Advantage', 'GCP-native deployment support', 'Technical validation review'],
    commissionRate: '3-20%',
  },
  {
    id: 'salesforce-appexchange',
    name: 'Salesforce AppExchange',
    logo: 'ri-community-line',
    category: 'Productivity',
    region: 'Global',
    description: 'World\'s leading enterprise cloud marketplace for Salesforce-integrated business applications.',
    fullDescription: 'Salesforce AppExchange is the largest enterprise cloud marketplace with over 7,000 solutions and 10 million customer installs. It provides unparalleled access to the Salesforce ecosystem, enabling vendors to reach CRM-centric buyers with tightly integrated apps, components, and consulting services.',
    rating: 4.7,
    vendorCount: 5200,
    connected: true,
    eligibility: ['Salesforce ISV partnership', 'Security review completion', 'AppExchange listing requirements'],
    commissionRate: '15-25%',
  },
  {
    id: 'hubspot-marketplace',
    name: 'HubSpot App Marketplace',
    logo: 'ri-hub-line',
    category: 'Productivity',
    region: 'Global',
    description: 'Growing ecosystem of integrations for marketing, sales, and service software.',
    fullDescription: 'The HubSpot App Marketplace connects over 1,500 third-party apps with HubSpot\'s CRM platform. Vendors benefit from HubSpot\'s rapidly growing customer base of 194,000+ companies and the platform\'s strong developer ecosystem for building deep, data-rich integrations.',
    rating: 4.3,
    vendorCount: 1500,
    connected: false,
    eligibility: ['HubSpot developer account', 'App certification process', 'OAuth 2.0 authentication'],
    commissionRate: '20%',
  },
  {
    id: 'connectwise',
    name: 'ConnectWise Marketplace',
    logo: 'ri-links-line',
    category: 'Security',
    region: 'North America',
    description: 'IT solutions marketplace built for MSPs and technology solution providers.',
    fullDescription: 'ConnectWise Marketplace offers a curated selection of integrations and solutions designed specifically for MSPs and IT solution providers. The platform provides seamless integration with ConnectWise PSA, RMM, and security tools, enabling vendors to reach a dedicated channel of technology professionals.',
    rating: 4.2,
    vendorCount: 950,
    connected: false,
    eligibility: ['ConnectWise Invent program', 'Integration with ConnectWise PSA or RMM', 'MSP channel readiness'],
    commissionRate: '10-15%',
  },
  {
    id: 'zomentum',
    name: 'Zomentum',
    logo: 'ri-rocket-2-line',
    category: 'Productivity',
    region: 'North America',
    description: 'Revenue acceleration platform helping partners discover and sell SaaS solutions.',
    fullDescription: 'Zomentum is a revenue platform purpose-built for IT channel partners. Its marketplace enables vendors to connect with a growing network of MSPs and VARs looking for curated technology solutions, providing guided selling tools, proposal automation, and integrated procurement workflows.',
    rating: 4.1,
    vendorCount: 620,
    connected: false,
    eligibility: ['Channel-ready product', 'Partner pricing model', 'API documentation'],
    commissionRate: '12-18%',
  },
  {
    id: 'sherweb',
    name: 'Sherweb Marketplace',
    logo: 'ri-store-3-line',
    category: 'Security',
    region: 'North America',
    description: 'Cloud marketplace for MSPs offering curated security, productivity, and backup solutions.',
    fullDescription: 'Sherweb is a cloud solutions marketplace that serves managed service providers and IT professionals. The platform specializes in curated security, productivity, and infrastructure solutions with a focus on simplified billing, provisioning, and support, enabling MSPs to efficiently deliver cloud services to their customers.',
    rating: 4.4,
    vendorCount: 780,
    connected: false,
    eligibility: ['Cloud-native SaaS product', 'Multi-tenant support', 'MSP billing model compatibility'],
    commissionRate: '15-20%',
  },
  {
    id: 'also-marketplace',
    name: 'ALSO Cloud Marketplace',
    logo: 'ri-global-line',
    category: 'Infrastructure',
    region: 'Europe',
    description: 'European cloud distribution platform connecting vendors with over 110,000 resellers.',
    fullDescription: 'ALSO Cloud Marketplace is one of Europe\'s largest cloud distribution platforms, providing access to a network of over 110,000 resellers across 30+ countries. The platform offers automated provisioning, multi-currency billing, and localized go-to-market support for vendors expanding into the European market.',
    rating: 4.2,
    vendorCount: 1100,
    connected: false,
    eligibility: ['European data residency options', 'GDPR compliance', 'Reseller-friendly licensing model'],
    commissionRate: '18-25%',
  },
  {
    id: 'mirakl',
    name: 'Mirakl Connect',
    logo: 'ri-building-4-line',
    category: 'Productivity',
    region: 'Europe',
    description: 'B2B enterprise marketplace platform powering digital commerce for large organizations.',
    fullDescription: 'Mirakl Connect is the leading marketplace SaaS platform used by enterprises worldwide to launch and grow their own marketplace businesses. For SaaS vendors, Mirakl provides access to a curated network of enterprise buyers across industries including retail, financial services, and manufacturing.',
    rating: 4.3,
    vendorCount: 860,
    connected: false,
    eligibility: ['Enterprise-grade SaaS product', 'API-first integration', 'Marketplace operator approval'],
    commissionRate: '10-15%',
  },
  {
    id: 'rhipe',
    name: 'rhipe Marketplace',
    logo: 'ri-earth-line',
    category: 'Infrastructure',
    region: 'Asia-Pacific',
    description: 'Leading APAC cloud distributor supporting MSPs across Australia, New Zealand, and Southeast Asia.',
    fullDescription: 'rhipe (now part of Crayon) is the Asia-Pacific region\'s premier cloud distribution platform. It provides vendors with access to thousands of MSPs and resellers across Australia, New Zealand, and Southeast Asian markets, with localized support, billing, and go-to-market programs.',
    rating: 4.1,
    vendorCount: 680,
    connected: false,
    eligibility: ['APAC market readiness', 'Cloud distribution agreement', 'Partner enablement materials'],
    commissionRate: '20-28%',
  },
  {
    id: 'digital-river',
    name: 'Digital River',
    logo: 'ri-shopping-cart-2-line',
    category: 'Productivity',
    region: 'Global',
    description: 'Global commerce platform enabling SaaS companies to sell subscriptions in 200+ markets worldwide.',
    fullDescription: 'Digital River provides a comprehensive commerce-as-a-service platform that handles global payments, tax compliance, fraud management, and subscription billing for SaaS companies. With localized checkout experiences in 200+ markets, it enables vendors to expand internationally without managing complex regulatory requirements.',
    rating: 4.3,
    vendorCount: 1800,
    connected: false,
    eligibility: ['Global entity or fiscal representative', 'Subscription billing model', 'PCI DSS compliance'],
    commissionRate: '8-15%',
  },
  {
    id: 'cloudblu',
    name: 'CloudBlue',
    logo: 'ri-cloud-windy-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Hyperscale marketplace platform powering cloud ecosystem commerce for service providers and vendors.',
    fullDescription: 'CloudBlue (an Ingram Micro company) is a hyperscale digital platform that powers cloud ecosystem commerce. It enables service providers, distributors, and vendors to manage the entire subscription lifecycle with automated fulfillment, catalog syndication, and multi-tier channel distribution capabilities.',
    rating: 4.2,
    vendorCount: 2400,
    connected: false,
    eligibility: ['CloudBlue Connect onboarding', 'Subscription management API', 'Multi-tier distribution readiness'],
    commissionRate: '12-20%',
  },
  {
    id: 'vendasta',
    name: 'Vendasta Marketplace',
    logo: 'ri-store-line',
    category: 'Productivity',
    region: 'North America',
    description: 'White-label marketplace platform helping channel partners sell SaaS to local businesses.',
    fullDescription: 'Vendasta provides a white-label marketplace platform that enables channel partners, agencies, and media companies to sell curated SaaS solutions to local businesses. Vendors gain access to a network of 65,000+ partners who resell digital products to SMBs across North America.',
    rating: 4.0,
    vendorCount: 540,
    connected: false,
    eligibility: ['SMB-focused product', 'White-label capability', 'Partner onboarding program'],
    commissionRate: '20-30%',
  },
  {
    id: 'scalepad',
    name: 'ScalePad Marketplace',
    logo: 'ri-line-chart-line',
    category: 'Security',
    region: 'North America',
    description: 'MSP-focused platform offering curated backup, security, and lifecycle management subscriptions.',
    fullDescription: 'ScalePad (formerly Warranty Master and Lifecycle Manager) provides MSPs with a unified platform for hardware lifecycle management, backup monitoring, and security compliance. Its marketplace offers curated SaaS subscriptions that integrate directly into MSP workflows and PSA tools.',
    rating: 4.1,
    vendorCount: 420,
    connected: false,
    eligibility: ['MSP-compatible licensing', 'PSA/RMM integration', 'Channel-first go-to-market'],
    commissionRate: '15-22%',
  },
];

const CATEGORIES = ['All', 'Productivity', 'Security', 'Infrastructure'];
const REGIONS = ['All', 'Global', 'North America', 'Europe', 'Asia-Pacific'];
const STATUSES = ['All', 'Connected', 'Not Connected'];
const SALES_CHANNEL_OPTIONS = ['All', ...Array.from(new Set(CHANNELS.map((c) => c.name))).sort()];

// ============================= HELPERS =============================

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: React.ReactNode[] = [];
  for (let i = 0; i < full; i++) {
    stars.push(<i key={`f${i}`} className="ri-star-fill" style={{ color: '#fab005', fontSize: 13 }} />);
  }
  if (half) {
    stars.push(<i key="h" className="ri-star-half-fill" style={{ color: '#fab005', fontSize: 13 }} />);
  }
  const remaining = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < remaining; i++) {
    stars.push(<i key={`e${i}`} className="ri-star-line" style={{ color: 'var(--mantine-color-gray-3)', fontSize: 13 }} />);
  }
  return stars;
}

const categoryColors: Record<string, string> = {
  Productivity: 'blue',
  Security: 'red',
  Infrastructure: 'teal',
};

// ============================= CHANNEL CARD =============================

interface ChannelCardProps {
  channel: SalesChannel;
  onViewDetails: () => void;
}

function ChannelCard({ channel, onViewDetails }: ChannelCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 4,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        boxShadow: hovered ? 'var(--mantine-shadow-sm)' : 'var(--mantine-shadow-xs)',
        transition: 'box-shadow 120ms, border-color 120ms',
        borderColor: hovered ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-gray-3)',
        height: '100%',
      }}
    >
      <Inline gap="sm" align="center">
        <Avatar
          radius="sm"
          size="md"
          color={categoryColors[channel.category] ?? 'gray'}
        >
          <i className={channel.logo} style={{ fontSize: 20 }} />
        </Avatar>
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Inline gap="xs" align="center">
            <Title order={5} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {channel.name}
            </Title>
            {channel.connected && (
              <i className="ri-checkbox-circle-fill" style={{ color: '#2f9e44', fontSize: 16, flexShrink: 0 }} />
            )}
          </Inline>
          <Badge color={categoryColors[channel.category] ?? 'gray'} size="xs">
            {channel.category}
          </Badge>
        </Box>
      </Inline>

      <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1 }}>
        {channel.description}
      </Text>

      <Inline gap="md" align="center">
        <Inline gap={2} align="center">
          {renderStars(channel.rating)}
          <Text size="xs" fw={600} ml={4}>{channel.rating}</Text>
        </Inline>
        <Text size="xs" c="dimmed">
          {channel.vendorCount.toLocaleString()} vendors
        </Text>
      </Inline>

      <Button variant="default" size="xs" onClick={onViewDetails} fullWidth>
        View Details
      </Button>
    </Box>
  );
}

// ============================= DETAIL DRAWER =============================

interface ChannelDetailDrawerProps {
  channel: SalesChannel | null;
  onClose: () => void;
}

function ChannelDetailDrawer({ channel, onClose }: ChannelDetailDrawerProps) {
  if (!channel) return null;

  const drawerTitle = (
    <Box>
      <Inline gap="sm" align="center" mb="xs">
        <Avatar
          radius="sm"
          size="md"
          color={categoryColors[channel.category] ?? 'gray'}
        >
          <i className={channel.logo} style={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Title order={4}>{channel.name}</Title>
          <Inline gap="xs" align="center">
            <Badge color={categoryColors[channel.category] ?? 'gray'} size="xs">
              {channel.category}
            </Badge>
            {channel.connected && (
              <Badge color="success" size="xs">Connected</Badge>
            )}
          </Inline>
        </Box>
      </Inline>
    </Box>
  );

  return (
    <Drawer
      opened={!!channel}
      onClose={onClose}
      title={drawerTitle}
      size="lg"
      position="right"
    >
      <Stack gap="md">
        <Inline gap={2} align="center">
          {renderStars(channel.rating)}
          <Text size="sm" fw={600} ml={4}>{channel.rating}</Text>
          <Text size="sm" c="dimmed" ml="xs">
            {channel.vendorCount.toLocaleString()} vendors
          </Text>
        </Inline>

        <Divider />

        <Box>
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs" style={{ letterSpacing: '0.06em' }}>
            Description
          </Text>
          <Text size="sm">{channel.fullDescription}</Text>
        </Box>

        <Box
          bd="1px solid var(--mantine-color-gray-3)"
          p="md"
          style={{ borderRadius: 4, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>
              Category
            </Text>
            <Badge color={categoryColors[channel.category] ?? 'gray'} size="sm">
              {channel.category}
            </Badge>
          </Box>
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>
              Region
            </Text>
            <Text size="sm" fw={600}>{channel.region}</Text>
          </Box>
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>
              Commission Rate
            </Text>
            <Text size="sm" fw={600} ff="monospace">{channel.commissionRate}</Text>
          </Box>
          <Box>
            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb={4} style={{ letterSpacing: '0.06em' }}>
              Active Vendors
            </Text>
            <Text size="sm" fw={600} ff="monospace">{channel.vendorCount.toLocaleString()}</Text>
          </Box>
        </Box>

        <Box>
          <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs" style={{ letterSpacing: '0.06em' }}>
            Eligibility Requirements
          </Text>
          <Stack gap="xs">
            {channel.eligibility.map((req, i) => (
              <Inline key={i} gap="xs" align="flex-start">
                <i
                  className="ri-checkbox-circle-line"
                  style={{ color: '#2f9e44', fontSize: 16, marginTop: 2, flexShrink: 0 }}
                />
                <Text size="sm">{req}</Text>
              </Inline>
            ))}
          </Stack>
        </Box>

        <Divider />

        <Button
          variant="primary"
          leftSection={<i className="ri-mail-send-line" />}
          fullWidth
        >
          Contact Channel
        </Button>
      </Stack>
    </Drawer>
  );
}

// ============================= FILTER CHIP =============================

interface FilterChipGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

function FilterChipGroup({ label, options, value, onChange }: FilterChipGroupProps) {
  return (
    <Inline gap="xs" align="center" style={{ flexWrap: 'wrap' }}>
      <Text size="xs" fw={600} c="dimmed" style={{ flexShrink: 0 }}>{label}:</Text>
      <Inline gap={4}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <Box
              key={opt}
              component="button"
              onClick={() => onChange(opt)}
              style={{
                padding: '4px 10px',
                fontSize: 12,
                fontWeight: active ? 600 : 500,
                fontFamily: 'inherit',
                color: active ? '#326FDE' : 'var(--mantine-color-gray-7)',
                background: active ? 'rgba(50,111,222,0.08)' : 'var(--mantine-color-gray-0)',
                border: `1px solid ${active ? 'rgba(50,111,222,0.4)' : 'var(--mantine-color-gray-3)'}`,
                borderRadius: 4,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 100ms',
              }}
            >
              {opt}
            </Box>
          );
        })}
      </Inline>
    </Inline>
  );
}

// ============================= MAIN PAGE =============================

function SalesChannelsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [salesChannelFilter, setSalesChannelFilter] = useState('All');
  const [activeChannel, setActiveChannel] = useState<SalesChannel | null>(null);

  const filtered = useMemo(() => {
    let result = CHANNELS;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      );
    }

    if (categoryFilter && categoryFilter !== 'All') {
      result = result.filter((c) => c.category === categoryFilter);
    }

    if (regionFilter && regionFilter !== 'All') {
      result = result.filter((c) => c.region === regionFilter);
    }

    if (statusFilter === 'Connected') {
      result = result.filter((c) => c.connected);
    } else if (statusFilter === 'Not Connected') {
      result = result.filter((c) => !c.connected);
    }

    if (salesChannelFilter && salesChannelFilter !== 'All') {
      result = result.filter((c) => c.name === salesChannelFilter);
    }

    return result;
  }, [search, categoryFilter, regionFilter, statusFilter, salesChannelFilter]);

  const hasActiveFilters =
    (categoryFilter && categoryFilter !== 'All') ||
    (regionFilter && regionFilter !== 'All') ||
    statusFilter !== 'All' ||
    salesChannelFilter !== 'All' ||
    search.trim();

  return (
    <Stack gap="lg">
      {/* Page header */}
      <Stack gap="xs">
        <Title order={2} style={{ letterSpacing: '-0.01em' }}>Sales Channels</Title>
        <Text size="sm" c="dimmed">
          Browse and connect with SaaS marketplaces to distribute your products.
        </Text>
      </Stack>

      {/* Search + filters */}
      <Box
        bd="1px solid var(--mantine-color-gray-3)"
        bg="white"
        p="md"
        style={{ borderRadius: 4, boxShadow: 'var(--mantine-shadow-xs)' }}
      >
        <Stack gap="sm">
          <Inline gap="sm" align="flex-end" style={{ flexWrap: 'wrap' }}>
            <Box style={{ flex: '1 1 280px', maxWidth: '50%' }}>
              <TextInput
                placeholder="Search channels by name, category, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                leftSection={<i className="ri-search-line" style={{ fontSize: 16 }} />}
              />
            </Box>
            <Box style={{ width: 220 }}>
              <Select
                value={salesChannelFilter}
                onChange={(v) => setSalesChannelFilter(v ?? 'All')}
                data={SALES_CHANNEL_OPTIONS.map((name) => ({ value: name, label: name === 'All' ? 'All Sales Channels' : name }))}
              />
            </Box>
          </Inline>
          <Inline gap="lg" align="center" style={{ flexWrap: 'wrap' }}>
            <FilterChipGroup
              label="Category"
              options={CATEGORIES}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
            <FilterChipGroup
              label="Region"
              options={REGIONS}
              value={regionFilter}
              onChange={setRegionFilter}
            />
            <FilterChipGroup
              label="Status"
              options={STATUSES}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </Inline>
        </Stack>
      </Box>

      {/* Results count + clear */}
      <Inline justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          <Text span fw={600} c="dark">{filtered.length}</Text> channel{filtered.length === 1 ? '' : 's'}
        </Text>
        {hasActiveFilters && (
          <Button
            variant="subtle"
            size="xs"
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setRegionFilter('All');
              setStatusFilter('All');
              setSalesChannelFilter('All');
            }}
            leftSection={<i className="ri-close-line" />}
          >
            Clear filters
          </Button>
        )}
      </Inline>

      {/* Card grid */}
      {filtered.length > 0 ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 4 }}
          spacing="md"
        >
          {filtered.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onViewDetails={() => setActiveChannel(channel)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box
          bd="1px solid var(--mantine-color-gray-3)"
          bg="white"
          style={{ borderRadius: 4, padding: '60px 16px', textAlign: 'center' }}
        >
          <Stack gap="xs" align="center">
            <i className="ri-store-2-line" style={{ fontSize: 32, color: 'var(--mantine-color-gray-4)' }} />
            <Text fw={600} c="dimmed">No channels match your filters</Text>
            <Text size="sm" c="dimmed">Try adjusting your search or clearing filters.</Text>
          </Stack>
        </Box>
      )}

      {/* Detail drawer */}
      <ChannelDetailDrawer
        channel={activeChannel}
        onClose={() => setActiveChannel(null)}
      />
    </Stack>
  );
}

// ============================= ROUTE EXPORT =============================

export default function SalesChannelsRoute() {
  return <SalesChannelsPage />;
}
