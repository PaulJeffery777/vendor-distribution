'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  SingleColumnLayout,
  Alert,
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
  Table,
  ActionIcon,
} from '@/components/DesignSystem';
import { Menu as MantineMenu } from '@mantine/core';

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
    id: 'meridian-commerce',
    name: 'Meridian Commerce',
    logo: 'ri-cloud-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Enterprise-grade cloud marketplace with deep channel partner network and provisioning tools.',
    fullDescription: 'Meridian Commerce is one of the largest cloud distribution platforms, serving over 200,000 channel partners globally. The platform offers automated provisioning, billing integration, and a partner ecosystem that spans MSPs, VARs, and system integrators across 64 countries.',
    rating: 4.5,
    vendorCount: 2800,
    connected: true,
    eligibility: ['Cloud-native architecture', 'Multi-tenant support', 'Partner program enrollment'],
    commissionRate: '18-25%',
  },
  {
    id: 'crestline-streamhub',
    name: 'Crestline StreamHub',
    logo: 'ri-exchange-line',
    category: 'Infrastructure',
    region: 'North America',
    description: 'Unified cloud platform providing end-to-end lifecycle management for technology solutions.',
    fullDescription: 'Crestline StreamHub is a cloud aggregation and orchestration platform that simplifies the procurement and management of cloud services. It serves as a single point of integration for resellers and MSPs to discover, provision, and manage multi-vendor cloud solutions with automated billing.',
    rating: 4.3,
    vendorCount: 1950,
    connected: false,
    eligibility: ['Vendor onboarding application', 'Technical integration assessment', 'Revenue share agreement'],
    commissionRate: '15-22%',
  },
  {
    id: 'stratosphere',
    name: 'Stratosphere Marketplace',
    logo: 'ri-shield-star-line',
    category: 'Security',
    region: 'North America',
    description: 'Cloud commerce marketplace purpose-built for MSPs to buy, sell, and manage technology.',
    fullDescription: 'Stratosphere Marketplace simplifies the way organizations buy, sell, and manage cloud solutions by serving as a born-in-the-cloud distribution platform exclusively for the MSP channel. Its curated marketplace focuses on best-of-breed solutions with deep integrations and white-glove vendor support.',
    rating: 4.7,
    vendorCount: 1400,
    connected: false,
    eligibility: ['MSP-ready product', 'Multi-tenant management console', 'API-first design'],
    commissionRate: '12-18%',
  },
  {
    id: 'apex-cloud-store',
    name: 'Apex Cloud Store',
    logo: 'ri-cloud-fill',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Digital catalog of thousands of software listings from independent vendors on a leading cloud platform.',
    fullDescription: 'Apex Cloud Store is a curated digital catalog that makes it easy for customers to find, buy, deploy, and manage third-party software, data, and services. Vendors benefit from a massive customer base, consolidated billing, and the ability to leverage customers\' existing committed cloud spend.',
    rating: 4.6,
    vendorCount: 4500,
    connected: true,
    eligibility: ['Partner network membership', 'Foundational technical review', 'SaaS or container deployment model'],
    commissionRate: '15-20%',
  },
  {
    id: 'horizon-cloud-market',
    name: 'Horizon Cloud Market',
    logo: 'ri-cloudy-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Enterprise commercial marketplace for purchasing and deploying cloud applications and services.',
    fullDescription: 'Horizon Cloud Market offers customers an extensive catalog of certified solutions optimized for its cloud platform. Vendors gain access to a large enterprise customer base, co-sell opportunities with platform sales teams, and the ability to transact against customers\' consumption commitment budgets.',
    rating: 4.5,
    vendorCount: 3800,
    connected: false,
    eligibility: ['Partner network enrollment', 'Cloud-compatible deployment', 'Commercial marketplace publisher account'],
    commissionRate: '3-20%',
  },
  {
    id: 'vertex-cloud-exchange',
    name: 'Vertex Cloud Exchange',
    logo: 'ri-cloud-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Enterprise marketplace for deploying production-grade solutions on a major cloud platform.',
    fullDescription: 'Vertex Cloud Exchange lets users quickly deploy functional software packages that run on its cloud infrastructure. The platform offers integrated billing, one-click deployment, and the ability for customers to use committed cloud spend on third-party solutions, driving faster sales cycles and enterprise adoption.',
    rating: 4.4,
    vendorCount: 2200,
    connected: false,
    eligibility: ['Cloud partner advantage program', 'Platform-native deployment support', 'Technical validation review'],
    commissionRate: '3-20%',
  },
  {
    id: 'nimbus-crm-exchange',
    name: 'Nimbus CRM Exchange',
    logo: 'ri-community-line',
    category: 'Productivity',
    region: 'Global',
    description: 'Leading enterprise cloud marketplace for CRM-integrated business applications.',
    fullDescription: 'Nimbus CRM Exchange is a major enterprise cloud marketplace with over 7,000 solutions and 10 million customer installs. It provides unparalleled access to a CRM ecosystem, enabling vendors to reach CRM-centric buyers with tightly integrated apps, components, and consulting services.',
    rating: 4.7,
    vendorCount: 5200,
    connected: true,
    eligibility: ['ISV partnership', 'Security review completion', 'Marketplace listing requirements'],
    commissionRate: '15-25%',
  },
  {
    id: 'presto-growth-hub',
    name: 'Presto Growth Hub',
    logo: 'ri-hub-line',
    category: 'Productivity',
    region: 'Global',
    description: 'Growing ecosystem of integrations for marketing, sales, and service software.',
    fullDescription: 'Presto Growth Hub connects over 1,500 third-party apps with its CRM platform. Vendors benefit from a rapidly growing customer base of 194,000+ companies and the platform\'s strong developer ecosystem for building deep, data-rich integrations.',
    rating: 4.3,
    vendorCount: 1500,
    connected: false,
    eligibility: ['Developer account', 'App certification process', 'OAuth 2.0 authentication'],
    commissionRate: '20%',
  },
  {
    id: 'techlink',
    name: 'TechLink Marketplace',
    logo: 'ri-links-line',
    category: 'Security',
    region: 'North America',
    description: 'IT solutions marketplace built for MSPs and technology solution providers.',
    fullDescription: 'TechLink Marketplace offers a curated selection of integrations and solutions designed specifically for MSPs and IT solution providers. The platform provides seamless integration with PSA, RMM, and security tools, enabling vendors to reach a dedicated channel of technology professionals.',
    rating: 4.2,
    vendorCount: 950,
    connected: false,
    eligibility: ['Vendor partner program', 'Integration with PSA or RMM tools', 'MSP channel readiness'],
    commissionRate: '10-15%',
  },
  {
    id: 'catalyze-partners',
    name: 'Catalyze Partners',
    logo: 'ri-rocket-2-line',
    category: 'Productivity',
    region: 'North America',
    description: 'Revenue acceleration platform helping partners discover and sell SaaS solutions.',
    fullDescription: 'Catalyze Partners is a revenue platform purpose-built for IT channel partners. Its marketplace enables vendors to connect with a growing network of MSPs and VARs looking for curated technology solutions, providing guided selling tools, proposal automation, and integrated procurement workflows.',
    rating: 4.1,
    vendorCount: 620,
    connected: false,
    eligibility: ['Channel-ready product', 'Partner pricing model', 'API documentation'],
    commissionRate: '12-18%',
  },
  {
    id: 'frostline',
    name: 'Frostline Marketplace',
    logo: 'ri-store-3-line',
    category: 'Security',
    region: 'North America',
    description: 'Cloud marketplace for MSPs offering curated security, productivity, and backup solutions.',
    fullDescription: 'Frostline Marketplace is a cloud solutions marketplace that serves managed service providers and IT professionals. The platform specializes in curated security, productivity, and infrastructure solutions with a focus on simplified billing, provisioning, and support, enabling MSPs to efficiently deliver cloud services to their customers.',
    rating: 4.4,
    vendorCount: 780,
    connected: false,
    eligibility: ['Cloud-native SaaS product', 'Multi-tenant support', 'MSP billing model compatibility'],
    commissionRate: '15-20%',
  },
  {
    id: 'eurogate-cloud',
    name: 'Eurogate Cloud Market',
    logo: 'ri-global-line',
    category: 'Infrastructure',
    region: 'Europe',
    description: 'European cloud distribution platform connecting vendors with over 110,000 resellers.',
    fullDescription: 'Eurogate Cloud Market is one of Europe\'s largest cloud distribution platforms, providing access to a network of over 110,000 resellers across 30+ countries. The platform offers automated provisioning, multi-currency billing, and localized go-to-market support for vendors expanding into the European market.',
    rating: 4.2,
    vendorCount: 1100,
    connected: false,
    eligibility: ['European data residency options', 'GDPR compliance', 'Reseller-friendly licensing model'],
    commissionRate: '18-25%',
  },
  {
    id: 'arcadia-connect',
    name: 'Arcadia Connect',
    logo: 'ri-building-4-line',
    category: 'Productivity',
    region: 'Europe',
    description: 'B2B enterprise marketplace platform powering digital commerce for large organizations.',
    fullDescription: 'Arcadia Connect is a leading marketplace SaaS platform used by enterprises worldwide to launch and grow their own marketplace businesses. For SaaS vendors, Arcadia provides access to a curated network of enterprise buyers across industries including retail, financial services, and manufacturing.',
    rating: 4.3,
    vendorCount: 860,
    connected: false,
    eligibility: ['Enterprise-grade SaaS product', 'API-first integration', 'Marketplace operator approval'],
    commissionRate: '10-15%',
  },
  {
    id: 'pacificedge',
    name: 'PacificEdge Marketplace',
    logo: 'ri-earth-line',
    category: 'Infrastructure',
    region: 'Asia-Pacific',
    description: 'Leading APAC cloud distributor supporting MSPs across Australia, New Zealand, and Southeast Asia.',
    fullDescription: 'PacificEdge Marketplace is the Asia-Pacific region\'s premier cloud distribution platform. It provides vendors with access to thousands of MSPs and resellers across Australia, New Zealand, and Southeast Asian markets, with localized support, billing, and go-to-market programs.',
    rating: 4.1,
    vendorCount: 680,
    connected: false,
    eligibility: ['APAC market readiness', 'Cloud distribution agreement', 'Partner enablement materials'],
    commissionRate: '20-28%',
  },
  {
    id: 'globalstream',
    name: 'GlobalStream Commerce',
    logo: 'ri-shopping-cart-2-line',
    category: 'Productivity',
    region: 'Global',
    description: 'Global commerce platform enabling SaaS companies to sell subscriptions in 200+ markets worldwide.',
    fullDescription: 'GlobalStream Commerce provides a comprehensive commerce-as-a-service platform that handles global payments, tax compliance, fraud management, and subscription billing for SaaS companies. With localized checkout experiences in 200+ markets, it enables vendors to expand internationally without managing complex regulatory requirements.',
    rating: 4.3,
    vendorCount: 1800,
    connected: false,
    eligibility: ['Global entity or fiscal representative', 'Subscription billing model', 'PCI DSS compliance'],
    commissionRate: '8-15%',
  },
  {
    id: 'alaro-distribution',
    name: 'Alaro Distribution',
    logo: 'ri-cloud-windy-line',
    category: 'Infrastructure',
    region: 'Global',
    description: 'Hyperscale marketplace platform powering cloud ecosystem commerce for service providers and vendors.',
    fullDescription: 'Alaro Distribution is a hyperscale digital platform that powers cloud ecosystem commerce. It enables service providers, distributors, and vendors to manage the entire subscription lifecycle with automated fulfillment, catalog syndication, and multi-tier channel distribution capabilities.',
    rating: 4.2,
    vendorCount: 2400,
    connected: false,
    eligibility: ['Platform onboarding', 'Subscription management API', 'Multi-tier distribution readiness'],
    commissionRate: '12-20%',
  },
  {
    id: 'trellis',
    name: 'Trellis Marketplace',
    logo: 'ri-store-line',
    category: 'Productivity',
    region: 'North America',
    description: 'White-label marketplace platform helping channel partners sell SaaS to local businesses.',
    fullDescription: 'Trellis Marketplace provides a white-label marketplace platform that enables channel partners, agencies, and media companies to sell curated SaaS solutions to local businesses. Vendors gain access to a network of 65,000+ partners who resell digital products to SMBs across North America.',
    rating: 4.0,
    vendorCount: 540,
    connected: false,
    eligibility: ['SMB-focused product', 'White-label capability', 'Partner onboarding program'],
    commissionRate: '20-30%',
  },
  {
    id: 'shieldpoint',
    name: 'ShieldPoint Marketplace',
    logo: 'ri-line-chart-line',
    category: 'Security',
    region: 'North America',
    description: 'MSP-focused platform offering curated backup, security, and lifecycle management subscriptions.',
    fullDescription: 'ShieldPoint Marketplace provides MSPs with a unified platform for hardware lifecycle management, backup monitoring, and security compliance. Its marketplace offers curated SaaS subscriptions that integrate directly into MSP workflows and PSA tools.',
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

// ============================= VENDOR CATALOG (mock) =============================

interface CatalogProduct {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  msrp: number;
  cost: number;
}

const VENDOR_CATALOG: CatalogProduct[] = [
  { id: 'PRD-001', name: 'Acme Cloud Storage', icon: 'ri-cloud-line', iconColor: 'blue', msrp: 19.99, cost: 9.99 },
  { id: 'PRD-002', name: 'Bitflow Data Stream', icon: 'ri-flow-chart', iconColor: 'violet', msrp: 49.00, cost: 29.00 },
  { id: 'PRD-003', name: 'EdgePoint Analytics', icon: 'ri-line-chart-line', iconColor: 'cyan', msrp: 79.00, cost: 49.00 },
  { id: 'PRD-004', name: 'Skybridge API Gateway', icon: 'ri-git-branch-line', iconColor: 'grape', msrp: 89.00, cost: 59.00 },
];

// ============================= OFFER TABLE =============================

interface OfferTableProps {
  offerValues: Record<string, string>;
  onOfferChange: (productId: string, value: string) => void;
  submitted: boolean;
}

function OfferTable({ offerValues, onOfferChange, submitted }: OfferTableProps) {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr style={{ borderBottom: '2px solid var(--mantine-color-gray-3)' }}>
          <Table.Th style={{ minWidth: 200 }}>Product</Table.Th>
          <Table.Th style={{ width: 90 }}>MSRP</Table.Th>
          <Table.Th style={{ width: 90 }}>Cost</Table.Th>
          <Table.Th style={{ width: 120 }}>Offer</Table.Th>
          <Table.Th style={{ width: 90 }}>Delta</Table.Th>
          <Table.Th style={{ width: 40 }} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {VENDOR_CATALOG.map((product) => {
          const offerRaw = offerValues[product.id] ?? product.cost.toFixed(2);
          const offerNum = parseFloat(offerRaw);
          const delta = Number.isFinite(offerNum) ? offerNum - product.cost : 0;

          return (
            <Table.Tr key={product.id}>
              <Table.Td>
                <Inline gap="sm" align="center">
                  <Avatar radius="sm" size="sm" color={product.iconColor}>
                    <i className={product.icon} style={{ fontSize: 14 }} />
                  </Avatar>
                  <Box>
                    <Text fz={14} fw={700} lh={1.4}>{product.name}</Text>
                    <Text fz={12} c="dimmed" lh={1.2}>Product ID: {product.id}</Text>
                  </Box>
                </Inline>
              </Table.Td>
              <Table.Td>
                <Text fz={14}>${product.msrp.toFixed(2)}</Text>
              </Table.Td>
              <Table.Td>
                <Text fz={14}>${product.cost.toFixed(2)}</Text>
              </Table.Td>
              <Table.Td>
                {submitted ? (
                  <Text fz={14}>${offerRaw}</Text>
                ) : (
                  <TextInput
                    size="xs"
                    value={offerRaw}
                    onChange={(e) => onOfferChange(product.id, e.currentTarget.value)}
                    leftSection={<Text fz={12} c="dimmed">$</Text>}
                    styles={{ input: { fontFamily: 'var(--font-inter)', width: 80 } }}
                  />
                )}
              </Table.Td>
              <Table.Td>
                <Text
                  fz={14}
                  fw={600}
                  c={delta < 0 ? 'red' : delta > 0 ? 'green' : undefined}
                >
                  {Number.isFinite(offerNum)
                    ? `${delta < 0 ? '-' : ''}$${Math.abs(delta).toFixed(2)}`
                    : '—'}
                </Text>
              </Table.Td>
              <Table.Td>
                <MantineMenu position="bottom-end" withinPortal>
                  <MantineMenu.Target>
                    <ActionIcon variant="link" size="sm">
                      <i className="ri-more-2-fill" style={{ fontSize: 16, color: 'var(--mantine-color-gray-6)' }} />
                    </ActionIcon>
                  </MantineMenu.Target>
                  <MantineMenu.Dropdown>
                    <MantineMenu.Item>View product</MantineMenu.Item>
                    <MantineMenu.Item>Edit pricing</MantineMenu.Item>
                    <MantineMenu.Item color="red">Remove</MantineMenu.Item>
                  </MantineMenu.Dropdown>
                </MantineMenu>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}

// ============================= DETAIL DRAWER =============================

interface ChannelDetailDrawerProps {
  channel: SalesChannel | null;
  onClose: () => void;
}

function ChannelDetailDrawer({ channel, onClose }: ChannelDetailDrawerProps) {
  const [showOfferTable, setShowOfferTable] = useState(false);
  const [offerValues, setOfferValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setShowOfferTable(false);
      setOfferValues({});
      setSubmitted(false);
    }, 300);
  }, [onClose]);

  const handleOfferChange = useCallback((productId: string, value: string) => {
    setOfferValues((prev) => ({ ...prev, [productId]: value }));
  }, []);

  const handleCreateOffer = useCallback(() => {
    const initial: Record<string, string> = {};
    VENDOR_CATALOG.forEach((p) => { initial[p.id] = p.cost.toFixed(2); });
    setOfferValues(initial);
    setShowOfferTable(true);
  }, []);

  const handleSubmitOffer = useCallback(() => {
    setSubmitted(true);
  }, []);

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
      onClose={handleClose}
      title={drawerTitle}
      size="lg"
      position="right"
      styles={{
        content: {
          transition: 'width 300ms ease',
          width: showOfferTable ? 820 : undefined,
        },
      }}
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

        <Inline gap="sm">
          <Button
            variant="primary"
            leftSection={<i className="ri-mail-send-line" />}
          >
            Contact Channel
          </Button>
          {!showOfferTable && (
            <Button
              variant="default"
              leftSection={<i className="ri-file-list-3-line" />}
              onClick={handleCreateOffer}
            >
              Create Offer
            </Button>
          )}
        </Inline>

        {showOfferTable && (
          <Box>
            {submitted && (
              <Box mb="md">
                <Alert color="success" title="Offer submitted">
                  Your offer has been successfully sent. We&apos;re waiting for merchant approval.
                </Alert>
              </Box>
            )}

            <Text size="xs" fw={600} tt="uppercase" c="dimmed" mb="xs" style={{ letterSpacing: '0.06em' }}>
              Product Offer
            </Text>

            <Box
              bd="1px solid var(--mantine-color-gray-3)"
              style={{ borderRadius: 4, overflow: 'hidden' }}
            >
              <OfferTable
                offerValues={offerValues}
                onOfferChange={handleOfferChange}
                submitted={submitted}
              />
            </Box>

            {!submitted && (
              <Inline justify="flex-end" mt="md">
                <Button variant="primary" onClick={handleSubmitOffer}>
                  Submit Offer
                </Button>
              </Inline>
            )}
          </Box>
        )}
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

// ============================= FEATURED UPGRADE CARDS =============================

function FeaturedUpgradeCards() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
      {/* Card 1 — AppDirect Network */}
      <Box
        bg="white"
        bd="1px solid var(--mantine-color-gray-3)"
        p="lg"
        style={{
          borderRadius: 4,
          boxShadow: 'var(--mantine-shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Inline gap="sm" align="center">
          <Box
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
              background: '#326FDE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <img src="/assets/AppDirect-Mark_White.svg" alt="AppDirect" style={{ width: 28, height: 28 }} />
          </Box>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Inline gap="xs" align="center">
              <Title order={4}>AppDirect Network</Title>
              <Badge color="violet" size="xs" leftSection={<i className="ri-lock-line" style={{ fontSize: 10 }} />}>
                Paid plan required
              </Badge>
            </Inline>
          </Box>
        </Inline>
        <Text size="sm" c="dimmed">
          Submit your products directly to the AppDirect Network Catalog. Merchants running
          AppDirect-powered marketplaces can discover and pull your products directly from the
          catalog, giving you instant reach across the AppDirect ecosystem.
        </Text>
        <Box mt="auto">
          <Button
            variant="primary"
            leftSection={<i className="ri-lock-line" />}
            fullWidth
          >
            Upgrade to unlock
          </Button>
        </Box>
      </Box>

      {/* Card 2 — Tackle */}
      <Box
        bg="white"
        bd="1px solid var(--mantine-color-gray-3)"
        p="lg"
        style={{
          borderRadius: 4,
          boxShadow: 'var(--mantine-shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <Inline gap="sm" align="center">
          <Box
            style={{
              width: 48,
              height: 48,
              borderRadius: 4,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img src="/assets/tackle-logo.png" alt="Tackle" style={{ width: 48, height: 48, display: 'block', objectFit: 'contain' }} />
          </Box>
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Inline gap="xs" align="center">
              <Title order={4}>Tackle — Hyperscaler Marketplaces</Title>
              <Badge color="violet" size="xs" leftSection={<i className="ri-lock-line" style={{ fontSize: 10 }} />}>
                Paid plan required
              </Badge>
            </Inline>
          </Box>
        </Inline>
        <Text size="sm" c="dimmed">
          Reach enterprise buyers on the world&apos;s largest cloud marketplaces — AWS Marketplace,
          Microsoft Azure Marketplace, and Google Cloud Marketplace — through Tackle&apos;s co-sell
          and private offer platform.
        </Text>
        <Box mt="auto">
          <Button
            variant="primary"
            leftSection={<i className="ri-lock-line" />}
            fullWidth
          >
            Upgrade to unlock
          </Button>
        </Box>
      </Box>
    </SimpleGrid>
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

      {/* Featured upgrade cards */}
      <FeaturedUpgradeCards />

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
